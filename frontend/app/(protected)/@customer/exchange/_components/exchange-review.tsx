"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { ReviewItem, ReviewItemList } from "@/components/common/ReviewItems";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useWallets } from "@/hooks/useWallets";
import type { IWallet } from "@/types/wallet";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TExchangeFormData } from "../page";

interface IExchangeReviewProps {
  values: TExchangeFormData;
  onNext: () => void;
  onPrev: () => void;
  nextLabel?: string;
  isLoading?: boolean;
}

export function ExchangeReview({
  values,
  onNext,
  onPrev,
  isLoading = false,
  nextLabel = "Exchange",
}: IExchangeReviewProps) {
  const { t } = useTranslation();
  const { wallets } = useWallets();
  const { data: exchangeInfo, isLoading: exchangeInfoIsLoading } =
    useExchangeRate({
      from: values.currencyFrom,
      to: values.currencyTo,
      amount: values.amount,
    });

  const walletForm: IWallet = wallets?.find(
    (w: IWallet) => w?.currency?.code === values?.currencyFrom,
  );

  const walletTo: IWallet = wallets?.find(
    (w: IWallet) => w?.currency?.code === values?.currencyTo,
  );

  return (
    <div>
      <h2 className="mb-8">{t("Confirm and proceed")}</h2>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="font-bold">{t("From")}</p>
          <div className="relative flex h-14 min-w-14 items-center justify-center gap-2">
            <Avatar className="size-10">
              <AvatarImage src={walletForm.logo} />
              <AvatarFallback className="bg-important font-bold text-important-foreground">
                {walletForm.currency.code}
              </AvatarFallback>
            </Avatar>

            <span className="font-bold">{walletForm?.currency?.code}</span>
          </div>
        </div>
        <div className="mb-7 h-1 flex-1 border-b border-dotted border-green-700" />
        <div>
          <p className="font-bold">{t("To")}</p>
          <div className="relative flex h-14 min-w-14 items-center justify-center gap-2">
            <Avatar className="size-10">
              <AvatarImage src={walletTo.logo} />
              <AvatarFallback className="bg-important font-bold text-important-foreground">
                {walletTo.currency.code}
              </AvatarFallback>
            </Avatar>

            <span className="font-bold">{walletTo?.currency?.code}</span>
          </div>
        </div>
      </div>

      {/* Exchange details */}
      <ReviewItemList groupName={t("Exchange details")}>
        <ReviewItem
          title={t("Exchange rate")}
          value={exchangeInfo?.exchangeRate}
          isLoading={exchangeInfoIsLoading}
        />
        <ReviewItem
          title={t("Exchange")}
          value={`${exchangeInfo?.amountFrom} ${exchangeInfo?.currencyFrom}`}
          isLoading={exchangeInfoIsLoading}
        />
        <ReviewItem
          title={t("Exchange amount")}
          value={`${exchangeInfo?.amountTo} ${exchangeInfo?.currencyTo}`}
          isLoading={exchangeInfoIsLoading}
        />
        <ReviewItem
          title={t("Service charge")}
          value={`${exchangeInfo?.fee} ${exchangeInfo?.currencyTo}`}
          isLoading={exchangeInfoIsLoading}
        />
        <ReviewItem
          title={t("You get")}
          value={`${exchangeInfo?.total} ${exchangeInfo?.currencyTo}`}
          valueClassName="text-xl sm:text-2xl font-semibold leading-8"
          isLoading={exchangeInfoIsLoading}
        />
      </ReviewItemList>

      {/* divider */}
      <Separator orientation="horizontal" className="my-7" />

      {/* Actions */}
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <Button
          variant="outline"
          onClick={onPrev}
          type="button"
          className="order-2 w-full sm:order-1 sm:w-fit"
        >
          <ChevronLeft size={16} />
          <span>{t("Back")}</span>
        </Button>

        <Button
          type="submit"
          onClick={onNext}
          disabled={isLoading}
          className="order-1 w-full sm:order-2 sm:max-w-48"
        >
          <Case condition={!isLoading}>
            <span>{t(nextLabel)}</span>
            <ChevronRight size={16} />
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
