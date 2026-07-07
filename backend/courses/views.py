import uuid

from django.conf import settings
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.http import urlencode
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.utils.decorators import method_decorator

from .models import Course, CoursePayment, Lesson, Enrollment, Level, Module

from progress.services import is_lesson_unlocked
from progress.services import unlock_initial_course_progress
from .payu import build_payment_hash, build_reverse_hash, format_amount, get_course_price, get_payu_checkout_url

from .serializers import (
    CourseSerializer,
    CourseListSerializer,
    LessonDetailSerializer,
    LessonSerializer,
    LevelSerializer,
    ModuleSerializer,
)


# Course Endpoints
class CourseListView(generics.ListAPIView):
    """List all published courses"""

    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseListSerializer
    permission_classes = [IsAuthenticated]


class CourseDetailView(APIView):
    """Get course details (requires enrollment)"""

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        enrollment = get_object_or_404(
            Enrollment, user=request.user, course_id=course_id
        )
        course = enrollment.course
        serializer = CourseSerializer(course)
        return Response(serializer.data)


class EnrolledCourseListView(APIView):
    """List all courses user is enrolled in"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        enrollments = Enrollment.objects.filter(user=request.user).select_related(
            "course"
        )
        courses = [e.course for e in enrollments]
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)


class PaymentCheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not settings.PAYU_MERCHANT_KEY or not settings.PAYU_MERCHANT_SALT:
            return Response(
                {"detail": "PayU is not configured"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        course_id = request.data.get("course_id")
        course = Course.objects.filter(id=course_id, is_published=True).first()
        if not course:
            return Response({"detail": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        if Enrollment.objects.filter(user=request.user, course=course, is_active=True).exists():
            return Response({"detail": "You are already enrolled in this course"}, status=status.HTTP_400_BAD_REQUEST)

        amount = get_course_price(course)
        txnid = f"course-{course.id}-{uuid.uuid4().hex[:20]}"
        payment = CoursePayment.objects.create(
            user=request.user,
            course=course,
            amount=amount,
            txnid=txnid,
        )

        firstname = request.user.first_name.strip() or request.user.email.split("@")[0]
        lastname = request.user.last_name.strip()
        amount_str = format_amount(amount)
        callback_url = request.build_absolute_uri(f"/api/courses/payments/payu/return/")
        fields = {
            "key": settings.PAYU_MERCHANT_KEY,
            "txnid": payment.txnid,
            "amount": amount_str,
            "productinfo": course.title,
            "firstname": firstname,
            "lastname": lastname,
            "email": request.user.email,
            "phone": str(getattr(request.user, "phone", "") or ""),
            "surl": callback_url,
            "furl": callback_url,
            "curl": callback_url,
            "udf1": str(payment.reference),
            "udf2": str(course.id),
            "service_provider": "payu_paisa",
        }
        fields["hash"] = build_payment_hash(fields, settings.PAYU_MERCHANT_SALT)
        payment.request_payload = fields
        payment.save(update_fields=["request_payload", "updated_at"])

        return Response({
            "payment_reference": str(payment.reference),
            "action": get_payu_checkout_url(),
            "method": "POST",
            "fields": fields,
        })


@method_decorator(csrf_exempt, name="dispatch")
class PaymentReturnView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        payload = {key: value for key, value in request.data.items()}
        txnid = payload.get("txnid", "")
        payment = CoursePayment.objects.filter(txnid=txnid).select_related("course", "user").first()
        if not payment:
            return HttpResponseRedirect(self._build_redirect_url("failed", None, "Unknown payment reference"))

        payment.response_payload = payload
        payment.payu_status = payload.get("status", "")
        payment.payu_payment_id = payload.get("mihpayid", "")
        payment.bank_ref_num = payload.get("bank_ref_num", "")
        payment.payment_mode = payload.get("mode", "")
        payment.error_message = payload.get("error_Message", "") or payload.get("error_message", "")

        expected_hash = build_reverse_hash(payload, settings.PAYU_MERCHANT_SALT)
        received_hash = str(payload.get("hash", "")).lower()
        if not received_hash or expected_hash != received_hash:
            payment.status = CoursePayment.STATUS_HASH_MISMATCH
            payment.save()
            return HttpResponseRedirect(self._build_redirect_url("failed", payment, "Payment verification failed"))

        expected_amount = format_amount(payment.amount)
        expected_course_id = str(payment.course_id)
        if (
            payload.get("key") != settings.PAYU_MERCHANT_KEY
            or payload.get("txnid") != payment.txnid
            or payload.get("amount") != expected_amount
            or payload.get("productinfo") != payment.course.title
            or payload.get("udf1") != str(payment.reference)
            or payload.get("udf2") != expected_course_id
        ):
            payment.status = CoursePayment.STATUS_HASH_MISMATCH
            payment.error_message = "Payment response does not match the initiated checkout"
            payment.save()
            return HttpResponseRedirect(
                self._build_redirect_url("failed", payment, "Payment verification failed")
            )

        status_value = payload.get("status", "").lower()
        if status_value == "success":
            payment.status = CoursePayment.STATUS_SUCCESS
            payment.paid_at = timezone.now()
            payment.save()

            enrollment, created = Enrollment.objects.get_or_create(
                user=payment.user,
                course=payment.course,
                defaults={"is_active": True},
            )
            if not created and not enrollment.is_active:
                enrollment.is_active = True
                enrollment.save(update_fields=["is_active"])
            if created:
                unlock_initial_course_progress(payment.user, payment.course)

            return HttpResponseRedirect(self._build_redirect_url("success", payment, "Payment successful"))

        payment.status = (
            CoursePayment.STATUS_PENDING if status_value == "pending" else CoursePayment.STATUS_FAILED
        )
        payment.save()
        message = payload.get("error_Message") or "Payment failed"
        return HttpResponseRedirect(self._build_redirect_url(status_value or "failed", payment, message))

    def get(self, request):
        return HttpResponseRedirect(self._build_redirect_url("failed", None, "Invalid payment return request"))

    def _build_redirect_url(self, status_value, payment, message):
        query = {
            "status": status_value,
            "message": message,
        }
        if payment is not None:
            query["payment"] = str(payment.reference)
            query["course"] = str(payment.course_id)
        return f"{settings.FRONTEND_BASE_URL.rstrip('/')}/purchase/result?{urlencode(query)}"


# Level Endpoints
class LevelListView(APIView):
    """List all levels for a course"""

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        # Verify enrollment
        get_object_or_404(Enrollment, user=request.user, course_id=course_id)

        levels = Level.objects.filter(course_id=course_id).order_by("order")

        serializer = LevelSerializer(
            levels, many=True, context={"request": request}
        )
        return Response(serializer.data)


class LevelDetailView(APIView):
    """Get a specific level with all its modules"""

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, level_id):
        # Verify enrollment
        get_object_or_404(Enrollment, user=request.user, course_id=course_id)

        level = get_object_or_404(Level, id=level_id, course_id=course_id)

        serializer = LevelSerializer(level, context={"request": request})
        return Response(serializer.data)


# Module Endpoints
class ModuleListView(APIView):
    """List all modules for a level"""

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, level_id):
        # Verify enrollment
        get_object_or_404(Enrollment, user=request.user, course_id=course_id)

        modules = Module.objects.filter(
            level_id=level_id, level__course_id=course_id
        ).order_by("order")

        serializer = ModuleSerializer(
            modules, many=True, context={"request": request}
        )
        return Response(serializer.data)


class ModuleDetailView(APIView):
    """Get a specific module with all its lessons"""

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, level_id, module_id):
        # Verify enrollment
        get_object_or_404(Enrollment, user=request.user, course_id=course_id)

        module = get_object_or_404(
            Module, id=module_id, level_id=level_id, level__course_id=course_id
        )

        serializer = ModuleSerializer(module, context={"request": request})
        return Response(serializer.data)


# Lesson Endpoints
class LessonListView(APIView):
    """List all lessons for a module"""

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, module_id):
        # Verify enrollment
        get_object_or_404(Enrollment, user=request.user, course_id=course_id)

        lessons = Lesson.objects.filter(
            module_id=module_id, module__level__course_id=course_id
        ).order_by("order")

        serializer = LessonSerializer(
            lessons, many=True, context={"request": request}
        )
        return Response(serializer.data)


class LessonDetailView(generics.RetrieveAPIView):
    """Get lesson details with rich lesson sections and FAQs"""

    queryset = Lesson.objects.select_related(
        "module", "module__level"
    ).prefetch_related("faqs")
    serializer_class = LessonDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        lesson = super().get_object()

        is_enrolled = Enrollment.objects.filter(
            user=self.request.user,
            course=lesson.module.level.course,
            is_active=True,
        ).exists()
        if not is_enrolled:
            raise PermissionDenied("You must be enrolled in this course")

        if not is_lesson_unlocked(self.request.user, lesson):
            raise PermissionDenied(
                "Complete the previous lesson before opening this lesson"
            )

        return lesson


class LessonFAQListView(APIView):
    """Get FAQs for a specific lesson"""

    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id):
        from .models import LessonFAQ

        faqs = LessonFAQ.objects.filter(lesson_id=lesson_id)
        data = [
            {"id": faq.id, "question": faq.question, "answer": faq.answer}
            for faq in faqs
        ]
        return Response(data)
