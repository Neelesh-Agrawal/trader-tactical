import * as React from "react";
import { cn } from "@/lib/utils";

interface PinInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

export const PinInput = React.forwardRef<HTMLDivElement, PinInputProps>(
  ({ length = 4, value, onChange, disabled = false, error = false, autoFocus = false }, ref) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, inputValue: string) => {
      // Only allow digits
      const digit = inputValue.replace(/\D/g, '').slice(-1);
      
      const newValue = value.split('');
      newValue[index] = digit;
      
      // Fill gaps with empty strings
      while (newValue.length < length) {
        newValue.push('');
      }
      
      const updatedValue = newValue.slice(0, length).join('');
      onChange(updatedValue);

      // Auto-focus next input
      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (!value[index] && index > 0) {
          // If current input is empty, go to previous
          inputRefs.current[index - 1]?.focus();
        } else {
          // Clear current
          const newValue = value.split('');
          newValue[index] = '';
          onChange(newValue.join(''));
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      onChange(pastedData);
      
      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    };

    React.useEffect(() => {
      if (autoFocus && inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, [autoFocus]);

    return (
      <div ref={ref} className="flex gap-2 sm:gap-3 justify-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              "w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-bold",
              "rounded-xl border-2 bg-background",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              value[index] ? "border-primary bg-primary/5" : "border-border",
              error && "border-destructive ring-destructive/20"
            )}
            aria-label={`PIN digit ${index + 1}`}
          />
        ))}
      </div>
    );
  }
);

PinInput.displayName = "PinInput";
