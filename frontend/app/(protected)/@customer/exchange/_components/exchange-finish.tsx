import { DownloadReceipt } from "@/components/common/DownloadReceipt";
import { ReviewItem, ReviewItemList } from "@/components/common/ReviewItems";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Separator from "@/components/ui/separator";
import { toggleBookmark } from "@/data/transaction-history/toggleBookmark";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useWallets } from "@/hooks/useWallets";
import cn, { copyContent } from "@/lib/utils";
import { IWallet } from "@/types/wallet";
import {
  ArrowRight2,
  ArrowRotateRight,
  DocumentCopy,
  More,
  Save2,
  TickCircle,
} from "iconsax-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { TExchangeFormData } from "../page";

export function ExchangeFinish({
  res,
  values,
  onAgainExchange,
}: {
  res: any;
  values: TExchangeFormData;
  onAgainExchange: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { wallets } = useWallets();

  const { data: exchangeInfo } = useExchangeRate({
    from: values.currencyFrom,
    to: values.currencyTo,
    amount: values.amount,
  });

  const walletForm: IWallet = wallets?.find(
    (w: IWallet) => w?.currency?.code === values?.currencyFrom,
  );

  // transaction bookmark handler
  const handleBookmarkRequest = (id: number) => {
    toast.promise(toggleBookmark(`${id}`), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res?.status) {
          throw new Error(res.message);
        }
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    <div>
      <h2 className="mb-1 flex items-center justify-center gap-2 text-xl font-semibold text-foreground sm:text-2xl">
        <TickCircle size="32" color="#13A10E" variant="Bold" />
        <span>{t("Exchange successful")}</span>
      </h2>
      <Separator orientation="horizontal" className="my-7" />

      {/* Exchange details */}
      <ReviewItemList groupName={t("Exchange details")}>
        <ReviewItem
          title={t("Exchange rate")}
          value={exchangeInfo?.exchangeRate}
        />
        <ReviewItem
          title={t("Exchange")}
          value={`${exchangeInfo?.amountFrom} ${exchangeInfo?.currencyFrom}`}
        />
        <ReviewItem
          title={t("Exchange amount")}
          value={`${exchangeInfo?.amountTo} ${exchangeInfo?.currencyTo}`}
        />
        <ReviewItem
          title={t("Service charge")}
          value={`${exchangeInfo?.fee} ${exchangeInfo?.currencyTo}`}
        />
        <ReviewItem
          title={t("You get")}
          value={`${exchangeInfo?.total} ${exchangeInfo?.currencyTo}`}
          valueClassName="text-xl sm:text-2xl font-semibold leading-8"
        />
      </ReviewItemList>

      <Separator orientation="horizontal" className="my-7" />

      <div className="mb-8 space-y-4">
        <h4 className="text-base font-medium sm:text-lg">{t("New balance")}</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="size-10">
              <AvatarImage src={walletForm?.logo} />
              <AvatarFallback className="bg-important font-bold text-important-foreground">
                {walletForm?.currency?.code}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-bold">
              {walletForm?.currency?.code}
            </span>
          </div>
          <p className="font-medium">{`${walletForm?.balance} ${walletForm?.currency?.code}`}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* Download receipt */}
        <DownloadReceipt trxId={res?.data?.trxId as string} />

        <div className="flex w-full flex-col justify-end gap-4 sm:flex-row">
          {/* Download or bookmark receipt  */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex w-full items-center space-x-1.5 md:w-fit",
                buttonVariants({ variant: "outline" }),
              )}
            >
              <span>{t("Menu")}</span>
              <More size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="m-0">
              <DropdownMenuItem
                onSelect={() => copyContent(res?.data?.trxId)}
                className="flex items-center gap-2 text-sm font-medium focus:text-primary"
              >
                <DocumentCopy size="20" variant="Outline" />
                {t("Copy transaction ID")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleBookmarkRequest(res?.data?.id)}
                className="flex items-center gap-2 text-sm font-medium focus:text-primary"
              >
                <Save2 size="20" variant="Outline" />
                {t("Bookmark receipt")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={onAgainExchange}
                className="flex items-center gap-2 text-sm font-medium focus:text-primary"
              >
                <ArrowRotateRight size="20" variant="Outline" />
                {t("Exchange again")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            onClick={() => router.push("/")}
            className="w-full md:max-w-48"
          >
            <span>{t("Go to dashboard")}</span>
            <ArrowRight2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
