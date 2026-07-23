import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { nismConfig } from '@/config/courseConfig';
import { useCourses } from '@/hooks/useCourses';
import { useNismEnrollment } from '@/hooks/useNismEnrollment';
import { useNismCheckout } from '@/hooks/useNismCheckout';

interface NismPrimaryActionProps {
  className?: string;
  showPrice?: boolean;
}

export const NismPrimaryAction = ({
  className,
  showPrice = true,
}: NismPrimaryActionProps) => {
  const { courses } = useCourses();
  const { isEnrolled, primaryLabel, primaryHref } = useNismEnrollment();
  const { startNismCheckout } = useNismCheckout();
  const nismCourse = courses.find((course) => course.title.trim().toLowerCase().includes('nism'));
  const resolvedPrice = nismCourse?.price_inr;

  if (!isEnrolled && (typeof resolvedPrice !== 'number' || !nismCourse)) {
    return null;
  }

  const label =
    isEnrolled || !showPrice
      ? primaryLabel
      : `${primaryLabel} — ₹${resolvedPrice}`;

  if (isEnrolled) {
    return (
      <Link to={primaryHref} className={cn(className)}>
        {label}
        <ArrowRight className="w-4 h-4" />
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => void startNismCheckout()} className={cn(className)}>
      {label}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
};
