"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import cn from "@/lib/utils";
import { Eye, EyeSlash } from "iconsax-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [isVisiblePassword, setIsVisiblePassword] = React.useState(false);
    return (
      <div className="relative">
        <Input
          type={isVisiblePassword ? "text" : "password"}
          className={cn(
            "placeholder:text-placeholder flex h-12 w-full rounded-[8px] border-none border-input bg-accent px-3 py-2 text-base font-normal ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        <Button
          aria-label="PasswordVisibilityToggler"
          variant="link"
          size="icon"
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisiblePassword((t) => !t);
          }}
        >
          {isVisiblePassword ? <Eye /> : <EyeSlash />}
        </Button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
