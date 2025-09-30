"use client";

import { Button } from "@/components/ui/button";
import cn from "@/lib/utils";
import { DocumentCopy } from "iconsax-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function TransactionIdRow({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const { t } = useTranslation();

  const copyContent = () => {
    navigator.clipboard
      .writeText(id)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => {
        toast.error("Failed to copy!");
      });
  };

  return (
    <div className={cn("inline-flex w-full items-center gap-4", className)}>
      <div className="flex-1">{t("Transaction ID")}</div>
      <div className="inline-flex items-center gap-4">
        <span>{id}</span>
        <Button type="button" onClick={copyContent} variant="outline" size="sm">
          <DocumentCopy size="20" />
        </Button>
      </div>
    </div>
  );
}
