import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
}

export const AnimatedCheckbox = ({ 
  checked, 
  onChange, 
  disabled = false,
  className 
}: AnimatedCheckboxProps) => {
  const [isFlashing, setIsFlashing] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    if (!checked) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 200);
    }
    
    onChange();
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "relative h-5 w-5 shrink-0 rounded-md border-2 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        !checked && "border-muted-foreground/50 hover:border-success hover:scale-110",
        checked && "border-success bg-success",
        isFlashing && "animate-checkbox-flash",
        className
      )}
    >
      {checked && (
        <Check 
          className={cn(
            "h-4 w-4 text-success-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "animate-checkbox-check"
          )} 
          strokeWidth={3}
        />
      )}
    </button>
  );
};
