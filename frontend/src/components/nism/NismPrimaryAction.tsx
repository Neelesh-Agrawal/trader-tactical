import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { nismConfig } from '@/config/courseConfig';
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
  const { isEnrolled, primaryLabel, primaryHref } = useNismEnrollment();
  const { startNismCheckout } = useNismCheckout();

  const label =
    isEnrolled || !showPrice
      ? primaryLabel
      : `${primaryLabel} — ₹${nismConfig.price}`;

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
