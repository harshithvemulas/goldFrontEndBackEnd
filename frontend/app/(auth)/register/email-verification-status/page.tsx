"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Separator from "@/components/ui/separator";
import { verifyAccount } from "@/data/auth/register";
import { ArrowRight2, TickCircle, TickSquare, Warning2 } from "iconsax-react";
import { Mail, TriangleAlert } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

interface PageProps {
  searchParams: {
    token: string;
  };
}

export const runtime = "edge";

export default function EmailVerificationStatus({ searchParams }: PageProps) {
  const { token } = searchParams;
  const [loading, setLoading] = React.useState(true);
  const [isVerified, setIsVerified] = React.useState<boolean | undefined>();

  const { t } = useTranslation();

  React.useEffect(() => {
    (async () => {
      const res = await verifyAccount({ token });
      if (res && res.status) {
        setIsVerified(true);
      } else setIsVerified(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (isVerified !== undefined) {
      setLoading(false);
    }
  }, [isVerified]);

  return (
    <div className="container mt-10 max-w-[716px] px-4 py-6">
      {/* success status */}
      <Case condition={!loading && isVerified === true}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <TickSquare size={70} variant="Bulk" className="text-success" />
            <h1 className="text-[32px] font-medium leading-10">
              {t("Verification Successful")}
            </h1>
          </div>

          <Separator className="mb-[2px] mt-[3px]" />

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <TickCircle
                size={17}
                variant="Bold"
                className="text-spacial-green"
              />
              <span className="text-sm font-semibold leading-5">
                {t("Account creation")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TickCircle
                size={17}
                variant="Bold"
                className="text-spacial-green"
              />
              <span className="text-sm font-semibold leading-5">
                {t("Email verification")}
              </span>
            </div>

            <p className="text-sm font-normal leading-[22px]">
              {t(
                "Congratulations! Your account has been successfully created and ready to use.",
              )}
            </p>
          </div>

          <Button
            className="h-10 max-w-[286px] gap-0.5 rounded-lg text-base font-medium leading-[22px]"
            asChild
          >
            <Link href="/signin" prefetch={false}>
              {t("Sign in to continue")}
              <ArrowRight2 size="16" />
            </Link>
          </Button>
        </div>
      </Case>

      {/* Failed status */}
      <Case condition={!loading && isVerified === false}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <Warning2 size={70} variant="Bulk" className="text-primary" />
            <h1 className="text-[32px] font-medium leading-10">
              {t("Verification failed, but don’t worry")}
            </h1>
          </div>

          <Separator className="mb-[2px] mt-[3px]" />

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <TickCircle
                size={17}
                variant="Bold"
                className="text-spacial-green"
              />
              <span className="text-sm font-semibold leading-5">
                {t("Account creation")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TriangleAlert
                size={17}
                className="fill-spacial-red text-background"
              />
              <span className="text-sm font-semibold leading-5 text-secondary-text">
                {t("Email verification")}
              </span>
            </div>

            <p className="text-sm font-normal leading-[22px]">
              {t(
                "Your account has been created but we’ve failed to verify your email. Don’t worry at all, you can sign in again to get a new link anytime.",
              )}
            </p>
          </div>

          <Button
            className="h-10 max-w-[286px] gap-0.5 rounded-lg text-base font-medium leading-[22px]"
            asChild
          >
            <Link href="/signin" prefetch={false}>
              {t("Sign in again to fix it")}
              <ArrowRight2 size="16" />
            </Link>
          </Button>
        </div>
      </Case>

      {/* pending */}
      <Case condition={loading}>
        <div className="flex h-full w-full flex-1 items-center justify-center">
          <Card className="w-full max-w-[400px] border-none shadow-none">
            <CardHeader className="items-center">
              <Mail size={48} strokeWidth={1.5} />
              <CardTitle className="mb-1">{t("Email Verifying...")}</CardTitle>
              <CardDescription className="text-center">
                {t(
                  "We are verifying your email address. This might take a few moments.",
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <Loader title={t("Please wait...")} />
            </CardContent>
          </Card>
        </div>
      </Case>
    </div>
  );
}
