"use client";

import { Button } from "@/components/ui/button";
import { configs } from "@/lib/configs";
import cn from "@/lib/utils";
import { DocumentDownload } from "iconsax-react";
import { useTranslation } from "react-i18next";

export function DownloadReceipt({
  trxId,
  className,
}: {
  trxId: string;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <Button
      variant="outline"
      type="button"
      className={cn("w-full md:w-auto", className)}
      asChild
    >
      <a href={`${configs.API_URL}/transactions/download-receipt/${trxId}`}>
        <DocumentDownload size={16} />
        <span>{t("Download Receipt")}</span>
      </a>
    </Button>
  );
}
