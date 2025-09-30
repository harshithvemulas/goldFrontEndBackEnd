"use client";

import { Button } from "@/components/ui/button";
import { resendEmailValidationCode } from "@/data/auth/register";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function ResendLinkButton({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const { t } = useTranslation();

  const resendLink = () => {
    toast.promise(resendEmailValidationCode(email ?? ""), {
      loading: t("Sending verification email..."),
      success: t("A new verification link has been sent to your email."),
      error: t("Failed to send verification email. Please try again."),
    });
  };

  return (
    <Button
      variant="link"
      className="px-0 pl-1 hover:underline"
      onClick={resendLink}
    >
      {children}
    </Button>
  );
}
