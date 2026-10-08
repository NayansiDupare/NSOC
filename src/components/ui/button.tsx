import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva("button", {
  variants: {
    variant: {
      primary: "button--primary",
      secondary: "button--secondary",
      ghost: "button--ghost",
    },
    size: {
      default: "button--default",
      sm: "button--sm",
      icon: "button--icon",
    },
  },
  defaultVariants: { variant: "primary", size: "default" },
});

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
