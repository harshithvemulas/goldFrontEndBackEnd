"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { ReviewItem, ReviewItemList } from "@/components/common/ReviewItems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { useSWR } from "@/hooks/useSWR";
import { Currency } from "@/lib/utils";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { useTranslation } from "react-i18next";
import type { TTransferFormData } from "../page";

interface IProps {
  onNext: () => void;
  onPrev: () => void;
  nextButtonLabel: string;
  isLoading?: boolean;
  formData: TTransferFormData;
}

export function TransferReview({
  onNext,
  onPrev,
  nextButtonLabel,
  isLoading = false,
  formData,
}: IProps) {
  const { t } = useTranslation();
  const { data: previewData } = useSWR(
    `/deposit-requests/direct-deposit/preview?email=${formData?.email}&amount=${formData.transferAmount}`,
  );

  const currency = new Currency(formData.transferWalletId);

  return (
    <div className="flex flex-col gap-y-4 md:gap-y-8 md:pt-6">
      <h2>{t("Confirm and proceed")}</h2>

      {/* Transfer details */}
      <ReviewItemList groupName={t("Deposit details")}>
        <ReviewItem
          title={t("Receiver will get")}
          value={currency.formatVC(previewData?.data?.amount)}
        />

        <ReviewItem
          title={t("Service charge")}
          value={
            previewData?.data?.fee > 0 ? (
              currency.formatVC(previewData?.data?.fee)
            ) : (
              <Badge variant="success">{t("Free")}</Badge>
            )
          }
        />

        <ReviewItem
          title={t("Total")}
          value={currency.formatVC(previewData?.data?.totalAmount)}
        />
      </ReviewItemList>

      <Separator className="mb-1 mt-[5px] bg-divider" />

      {/* Actions */}
      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline" onClick={onPrev} type="button">
          <ArrowLeft2 size={16} />
          <span>{t("Back")}</span>
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={isLoading}
          className="min-w-48"
        >
          <Case condition={!isLoading}>
            <span>{t(nextButtonLabel)}</span>
            <ArrowRight2 size={16} />
          </Case>

          <Case condition={isLoading}>
            <Loader
              title={t("Processing...")}
              className="text-primary-foreground"
            />
          </Case>
        </Button>
      </div>
    </div>
  );
}
