"use client";

import { AuthPageHeading } from "@/app/(auth)/_components/heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { useBranding } from "@/hooks/useBranding";
import { ArrowRight2, TickCircle } from "iconsax-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function EmailVerificationMessage() {
  const { t } = useTranslation();
  const { siteName } = useBranding();

  return (
    <div className="container mt-10 max-w-3xl px-4 py-6">
      <AuthPageHeading
        title={t("Check your email")}
        subTitle={t("Welcome to {{siteName}}", { siteName })}
      />

      <div className="my-6 flex h-[5px] items-center">
        <Separator className="bg-divider" />
      </div>

      <Alert className="border-0 bg-background p-3 shadow-default">
        <TickCircle
          size="16"
          color="#107C10"
          variant="Bold"
          className="-mt-0.5"
        />
        <AlertTitle className="text-sm font-semibold leading-5 text-foreground">
          {t("Verification link sent to your email")}
        </AlertTitle>
        <AlertDescription className="py-1.5 text-sm font-normal leading-5">
          {t(
            "We’ve sent you a link to the email address you provided, please click on the link to reset your password.",
          )}
        </AlertDescription>
      </Alert>

      <div className="mt-6 flex justify-end">
        <Button className="w-[286px]" asChild>
          <Link href="/signin" prefetch={false}>
            {t("Sign In")} <ArrowRight2 size={19} />
          </Link>
        </Button>
      </div>
    </div>
  );
}
