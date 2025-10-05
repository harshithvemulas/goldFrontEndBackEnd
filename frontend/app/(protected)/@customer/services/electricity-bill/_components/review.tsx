import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { ReviewItem, ReviewItemList } from "@/components/common/ReviewItems";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { previewElectricityBill } from "@/data/services/electricity-bill";
import { useWallets } from "@/hooks/useWallets";
import { TElectricityBillFormData } from "@/schema/electricity-bill-schema";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface IProps {
  onBack: () => void;
  onNext: () => void;
  isLoading: boolean;
  formData: TElectricityBillFormData;
  meterProvider: Record<string, any> | null;
}

export default function Review({
  formData,
  isLoading,
  onBack,
  onNext,
  meterProvider,
}: IProps) {
  const [isPending, startTransition] = React.useTransition();
  const [previewData, setPreviewData] = React.useState<any>({});
  const { wallets, getWalletByCurrencyCode } = useWallets();
  const { t } = useTranslation();

  const wallet = getWalletByCurrencyCode(
    wallets,
    formData.sender_wallet_id as string,
  );

  React.useEffect(() => {
    fetchPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPreview = async () => {
    startTransition(async () => {
      const data = {
        meterNumber: formData.meter_number,
        amount: Number(formData.bill_amount) as number,
        currencyCode: formData.sender_wallet_id as string,
        billerId: Number(formData.meter_provider),
      };

      const res = await previewElectricityBill(data);
      if (res.status) {
        setPreviewData(res?.data);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="mb-4">
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

      {isPending ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {/* Meter details */}
          <ReviewItemList groupName={t("Meter details")}>
            <ReviewItem
              title={t("Electricity name")}
              value={previewData?.receiver?.name || "N/A"}
            />

            <ReviewItem
              title={t("Meter number")}
              value={formData?.meter_number}
            />
          </ReviewItemList>

          <Separator className="my-8" />

          {/* Payment details */}
          <ReviewItemList groupName={t("Payment details")}>
            <ReviewItem
              title={t("Amount")}
              value={`${previewData?.sender?.sendingAmount || "0"} ${formData.sender_wallet_id}`}
            />
            <ReviewItem
              title={t("Service charge")}
              value={
                <>
                  <Case condition={meterProvider?.localTransactionFee === 0}>
                    <Badge className="bg-success text-success-foreground">
                      {t("Free")}
                    </Badge>
                  </Case>
                  <Case condition={meterProvider?.localTransactionFee !== 0}>
                    {previewData?.sender?.fee || "0"}{" "}
                    {formData.sender_wallet_id}
                  </Case>
                </>
              }
            />

            <ReviewItem
              title={t("Total")}
              value={`${Number(previewData?.sender?.receivingAmount || "0")} ${formData.sender_wallet_id}`}
            />
            <ReviewItem
              title={t("You will get")}
              value={`${Number(previewData?.receiver?.fxRate || "0")} ${previewData?.receiver?.currencyCode || ""}`}
            />
          </ReviewItemList>
        </>
      )}

      <Separator className="my-8" />

      <div className="mt-8 flex flex-1 justify-between gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft2 size={17} />
          {t("Back")}
        </Button>

        <Button
          onClick={onNext}
          disabled={isLoading || !previewData?.sender?.sendingAmount}
        >
          <Case condition={!isLoading}>
            {t("Pay bill")}
            <ArrowRight2 size={17} />
          </Case>
          <Case condition={isLoading}>
            <Loader
              title={t("Processing")}
              className="text-primary-foreground"
            />
          </Case>
        </Button>
      </div>
    </div>
  );
}
