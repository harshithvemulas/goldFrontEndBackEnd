"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight2, Shield } from "iconsax-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function KycWalletCard({
  isVerified = false,
  documentStatus,
}: {
  isVerified: boolean;
  documentStatus: "not submitted" | "submitted";
}) {
  const { t } = useTranslation();

  if (isVerified) return null;
  return (
    <div className="flex h-[182px] w-[350px] flex-col items-center justify-center rounded-2xl border border-primary bg-background p-4">
      <Shield variant="Bulk" className="mb-2.5 text-important" size={64} />

      <h6 className="font-bold">{t("Awaiting KYC verification")}</h6>

      {documentStatus === "not submitted" ? (
        <Button
          className="mt-auto w-full gap-[2px] rounded-lg px-4 py-2 text-base font-medium leading-[22px]"
          asChild
        >
          <Link href="/settings/kyc-verification-settings">
            {t("Submit Documents")}
            <ArrowRight2 size={16} />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
