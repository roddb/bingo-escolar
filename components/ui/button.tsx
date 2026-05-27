import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'clay-button inline-flex items-center justify-center whitespace-nowrap text-base font-bold tracking-wide disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        brand: 'bg-brand text-white hover:bg-brand/95',
        cta: 'bg-cta text-white hover:bg-cta/95',
        success: 'bg-success text-white hover:bg-success/95',
        danger: 'bg-danger text-white hover:bg-danger/95',
        ghost: 'bg-surface-raised text-ink hover:bg-surface',
        outline: 'bg-surface-raised text-ink border-2 border-brand/30 hover:border-brand',
      },
      size: {
        default: 'h-12 px-6 py-2',
        sm: 'h-10 px-4 text-sm',
        lg: 'h-16 px-8 text-xl',
        xl: 'h-20 px-12 text-2xl',
        icon: 'h-12 w-12 p-0',
      },
    },
    defaultVariants: {
      variant: 'brand',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
