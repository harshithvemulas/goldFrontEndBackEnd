import { Case } from "@/components/common/Case";
import { DownloadReceipt } from "@/components/common/DownloadReceipt";
import { ReviewItem, ReviewItemList } from "@/components/common/ReviewItems";
import { TransactionIdRow } from "@/components/common/TransactionIdRow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { useWallets } from "@/hooks/useWallets";
import cn, { copyContent, imageURL } from "@/lib/utils";
import {
  ArrowCircleRight2,
  ArrowRotateRight,
  DocumentCopy,
  More,
  Save2,
  TickCircle,
} from "iconsax-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function TransferFinish({
  res,
  onAgainTransfer,
}: {
  res: Record<string, any> | null;
  onAgainTransfer: () => void;
}) {
  const { t } = useTranslation();
  const data = res?.data;

  const { getWalletByCurrencyCode, wallets } = useWallets();

  const wallet = getWalletByCurrencyCode(wallets, data?.from?.currency);

  // transaction bookmark handler
  const onBookmark = (id: number) => {
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
    <div className="md:gap-y-8pt-6 flex flex-col gap-y-4">
      <h2 className="mb-1 flex items-center justify-center gap-2 text-2xl font-semibold text-foreground">
        <TickCircle size="32" color="#13A10E" variant="Bold" />
        <span>{t("Deposit successful")}</span>
      </h2>

      <Separator className="mb-1 mt-[5px] bg-divider" />


      {/* Transfer details */}
      <ReviewItemList groupName={t("Deposit details")}>
        <ReviewItem
          title={`${data?.to?.label} ${t("will get")}`}
          value={`${data?.amount} ${data?.from?.currency}`}
        />

        <ReviewItem
          title={t("Service charge")}
          value={
            <>
              <Case condition={data?.fee}>
                {`${data?.fee} ${data?.from?.currency}`}
              </Case>
              <Case condition={Number(data?.fee) === 0}>
                <Badge variant="success">{t("Free")}</Badge>
              </Case>
            </>
          }
        />

        <ReviewItem
          title={t("Total")}
          value={`${data?.total} ${data?.from?.currency}`}
          valueClassName="text-xl sm:text-2xl font-semibold"
        />
      </ReviewItemList>

      <Separator className="mb-1 mt-[5px] bg-divider" />

      {/* Transaction ID */}
      <TransactionIdRow
        id={data?.trxId}
        className="mb-4 text-sm sm:text-base"
      />

      <div className="mb-8 space-y-4 text-sm sm:text-base">
        <h4 className="text-base font-medium sm:text-lg">{t("New balance")}</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={wallet?.logo} />
              <AvatarFallback className="bg-important text-important-foreground">
                {wallet?.currency?.code}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-bold">{wallet?.currency?.code}</span>
          </div>
          <p className="font-medium">
            {`${wallet?.balance} ${wallet?.currency?.code}`}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Download Receipt */}
        <DownloadReceipt trxId={data?.trxId} className="w-full md:w-auto" />

        {/* More actions */}
        <div className="flex w-full flex-wrap gap-4 md:w-auto md:justify-end">
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
                onSelect={() => copyContent(data?.trxId)}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <DocumentCopy
                  size="20"
                  className="text-primary"
                  variant="Outline"
                />
                {t("Copy transaction ID")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onBookmark(data?.id)}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Save2 size="20" variant="Outline" />
                {t("Bookmark receipt")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={onAgainTransfer}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <ArrowRotateRight size="20" variant="Outline" />
                {t("Transfer again")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button type="button" className="w-full md:max-w-48" asChild>
            <Link href="/">
              <span>{t("Go to dashboard")}</span>
              <ArrowCircleRight2 size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
