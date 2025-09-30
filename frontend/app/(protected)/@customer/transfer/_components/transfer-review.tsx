"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { ReviewItem, ReviewItemList } from "@/components/common/ReviewItems";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSWR } from "@/hooks/useSWR";
import { useWallets } from "@/hooks/useWallets";
import { Currency, imageURL } from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { useTranslation } from "react-i18next";
import type { TTransferFormData } from "../page";

interface IProps {
  onNext: () => void;
  onPrev: () => void;
  nextButtonLabel: string;
  isLoading?: boolean;
  formData: TTransferFormData;
  user?: any;
}

export function TransferReview({
  onNext,
  onPrev,
  nextButtonLabel,
  isLoading = false,
  formData,
  user,
}: IProps) {
  const { t } = useTranslation();

  const { data: preview, isLoading: isDataFetching } = useSWR(
    `/transfers/preview/create?amount=${formData.amount}`,
  );

  const {
    wallets,
    isLoading: isWalletsDataLoading,
    getWalletByCurrencyCode,
  } = useWallets();

  const currency = new Currency(formData.currencyCode);
  const wallet = getWalletByCurrencyCode(wallets, formData.currencyCode);

  return (
    <div className="flex flex-col gap-y-4 md:gap-y-8">
      <h2>{t("Confirm and proceed")}</h2>

      {/* wallet profile */}
      <div className="flex flex-col gap-y-4">
        <h5 className="text-sm font-medium sm:text-base">
          {t("Selected wallet")}
        </h5>
        <div className="flex flex-row items-center gap-2.5">
          {isWalletsDataLoading ? (
            <>
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </>
          ) : (
            <>
              <Avatar className="size-8">
                <AvatarImage src={wallet?.logo} />
                <AvatarFallback className="bg-important text-xs font-bold text-important-foreground">
                  {wallet?.currency?.code}
                </AvatarFallback>
              </Avatar>
              <h6 className="font-bold">{wallet?.currency?.code}</h6>
            </>
          )}
        </div>
      </div>

      <Separator className="mb-1 mt-[5px] bg-divider" />

      {/* Transfer details */}
      <ReviewItemList groupName={t("Transfer details")}>
        <ReviewItem
          title={`${user?.name} ${t("will get")}`}
          value={currency.formatVC(preview?.data?.totalAmount)}
          isLoading={isDataFetching}
        />

        <ReviewItem
          title={t("Service charge")}
          isLoading={isDataFetching}
          value={
            preview?.data?.fee > 0 ? (
              currency.formatVC(preview?.data?.fee)
            ) : (
              <Badge variant="success">{t("Free")}</Badge>
            )
          }
        />

        <ReviewItem
          title={t("Total")}
          value={currency.formatVC(preview?.data?.formatedAmount)}
          isLoading={isDataFetching}
        />
      </ReviewItemList>

      <Separator className="mb-1 mt-[5px] bg-divider" />

      {/* User details */}
      <div className="flex flex-col gap-y-4">
        <h5 className="text-sm font-medium sm:text-base">{t("Recipient")}</h5>

        <div className="flex items-center gap-2.5">
          <Avatar>
            <AvatarImage src={imageURL(user?.avatar)} />
            <AvatarFallback>{getAvatarFallback(user?.name)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-secondary-text">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline" onClick={onPrev} type="button">
          <ArrowLeft2 size={16} />
          <span>{t("Back")}</span>
        </Button>
        <Button
          type="submit"
          onClick={onNext}
          disabled={isLoading}
          className="min-w-48"
        >
          <Case condition={!isLoading}>
            <span>{nextButtonLabel}</span>
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
