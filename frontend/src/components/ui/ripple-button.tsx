import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useRipple } from "@/hooks/useRipple";
import { Loader2, Check } from "lucide-react";

const buttonVariants = cva(
  "relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-[1.02]",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.02]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground hover:bg-success/90 hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface RippleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, isSuccess, children, onClick, ...props }, ref) => {
    const { createRipple, ripples } = useRipple();
    const Comp = asChild ? Slot : "button";

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(e);
      onClick?.(e);
    };

    return (
      <Comp 
        className={cn(buttonVariants({ variant, size, className }))} 
        ref={ref} 
        onClick={handleClick}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isSuccess ? (
          <Check className="h-4 w-4 animate-scale-in" />
        ) : null}
        {!isLoading && !isSuccess && children}
        {isLoading && <span className="ml-2">Loading...</span>}
        {isSuccess && <span className="ml-2">Success!</span>}
      </Comp>
    );
  },
);
RippleButton.displayName = "RippleButton";

export { RippleButton, buttonVariants };
