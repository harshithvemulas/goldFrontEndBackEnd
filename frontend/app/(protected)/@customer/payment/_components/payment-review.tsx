"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { ReviewItem, ReviewItemList } from "@/components/common/ReviewItems";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { useSWR } from "@/hooks/useSWR";
import { useWallets } from "@/hooks/useWallets";
import { imageURL } from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { useTranslation } from "react-i18next";

export default function PaymentReview({
  onNext,
  onBack,
  formData,
  isLoading = false,
  merchant,
}: {
  onNext: (res: any) => void;
  onBack: () => void;
  isLoading?: boolean;
  formData: {
    sender_wallet_id: string;
    receiver_merchant_id: string;
    amount: string;
  };
  merchant: any;
}) {
  // get wallet information
  const { wallets, getWalletByCurrencyCode } = useWallets();
  const { t } = useTranslation();
  const wallet = getWalletByCurrencyCode(wallets, formData.sender_wallet_id);
  const { data, isLoading: paymentDetailsIsLoading } = useSWR(
    `/payments/preview/create?amount=${formData.amount}`,
  );

  return (
    <div>
      <h2 className="mb-8">{t("Confirm and proceed")}</h2>
      <div className="flex flex-col gap-y-4">
        <h5 className="text-sm font-medium sm:text-base">
          {t("Selected wallet")}
        </h5>
        <div className="flex flex-row items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarImage src={wallet?.logo} />
            <AvatarFallback className="bg-important text-xs font-bold text-important-foreground">
              {wallet?.currency?.code}
            </AvatarFallback>
          </Avatar>
          <h6 className="font-bold">{wallet?.currency?.code}</h6>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Payment details */}
      <ReviewItemList>
        <ReviewItem
          title={`${merchant?.name} will get`}
          value={`${data?.data?.amount} ${formData.sender_wallet_id}`}
          isLoading={paymentDetailsIsLoading}
        />
        <ReviewItem
          title={t("Service charge")}
          value={
            <Badge variant="success" className="font-medium">
              {t("Free")}
            </Badge>
          }
          isLoading={paymentDetailsIsLoading}
        />

        <ReviewItem
          title={t("Total")}
          value={`${data?.data?.amount} ${formData.sender_wallet_id}`}
          isLoading={paymentDetailsIsLoading}
        />
      </ReviewItemList>

      <Separator className="my-8" />

      <div className="flex flex-col gap-4">
        <h5 className="text-medium text-sm sm:text-base">{t("Recipient")}</h5>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={imageURL(merchant?.profileImage)}
              alt={merchant?.name}
            />
            <AvatarFallback className="bg-primary font-bold text-primary-foreground">
              {getAvatarFallback(merchant?.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm sm:text-base">{merchant?.name}</p>
            <p className="text-[10px] text-secondary-text sm:text-xs">
              {merchant?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-1 justify-between gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft2 size={17} />
          {t("Back")}
        </Button>

        <Button disabled={isLoading} onClick={onNext}>
          <Case condition={!isLoading}>
            {t("Pay Now")}
            <ArrowRight2 size={17} />
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
