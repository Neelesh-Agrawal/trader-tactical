from django import forms
from django.forms.models import BaseInlineFormSet
from django_ckeditor_5.widgets import CKEditor5Widget

from .models import Question


class QuestionAdminForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = "__all__"
        widgets = {
            "text": CKEditor5Widget(config_name="default"),
            "explanation": CKEditor5Widget(config_name="default"),
        }


class FixedOptionInlineFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()

        option_count = 0
        correct_count = 0

        for form in self.forms:
            if not hasattr(form, "cleaned_data"):
                continue
            if form.cleaned_data.get("DELETE"):
                continue

            text = (form.cleaned_data.get("text") or "").strip()
            if not text:
                continue

            option_count += 1
            if form.cleaned_data.get("is_correct"):
                correct_count += 1

        if option_count != 4:
            raise forms.ValidationError("Each question must have exactly 4 options.")

        if correct_count != 1:
            raise forms.ValidationError("Each question must have exactly 1 correct option.")
