"use client";

import { AuthPageHeading } from "@/app/(auth)/_components/heading";
import { Case } from "@/components/common/Case";
import LoaderIcon from "@/components/icons/LoaderIcon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { resendEmailValidationCode } from "@/data/auth/register";
import { useBranding } from "@/hooks/useBranding";
import { ArrowLeft2, ArrowRight2, Refresh2, TickCircle } from "iconsax-react";
import Link from "next/link";
import { permanentRedirect, useSearchParams } from "next/navigation";
import { useLayoutEffect, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function EmailVerificationMessage() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { t } = useTranslation();
  const { siteName } = useBranding();

  useLayoutEffect(() => {
    if (!email) {
      permanentRedirect("/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resendLink = () => {
    startTransition(async () => {
      const res = await resendEmailValidationCode(email ?? "");
      if (res && res.status) {
        toast.success("Verification Email Sent");
      }
    });
  };

  return (
    <div className="container mt-10 max-w-[716px] px-4 py-6">
      <AuthPageHeading
        title={t("Please verify your email")}
        subTitle={t("Welcome to {{siteName}}, let's get start", { siteName })}
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
            "We’ve sent you a link to the email address you provided, please click on the link to verify your identity.",
          )}
        </AlertDescription>
      </Alert>

      <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Button
          variant="outline"
          type="button"
          className="order-2 h-10 w-full text-base font-medium leading-[22px] text-foreground sm:order-1 sm:max-w-[102px]"
          asChild
        >
          <Link href="/register">
            <ArrowLeft2 size="24" />
            {t("Back")}
          </Link>
        </Button>

        <div className="order-1 flex w-full flex-col items-center justify-end gap-4 sm:order-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={resendLink}
            disabled={isPending}
            className="w-full rounded-lg px-4 py-2 text-foreground sm:w-auto"
          >
            <Case condition={!isPending}>
              <Refresh2 size={15} />
              {t("Resend code")}
            </Case>

            <Case condition={isPending}>
              <LoaderIcon />
              {t("Processing...")}
            </Case>
          </Button>

          <Button
            type="button"
            className="w-full rounded-[8px] px-4 py-2 text-base font-medium leading-[22px] sm:max-w-[286px]"
            asChild
          >
            <Link href="/signin" prefetch={false}>
              {t("Sign in")}
              <ArrowRight2 size="16" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
