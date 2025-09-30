import InvestedDetailsModal from "@/app/(protected)/@customer/investments/_components/invested-details-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Separator from "@/components/ui/separator";
import { Investment } from "@/data/investments/activeInvestments";
import { withdrawInvestment } from "@/data/investments/withdrawInvestment";
import { startCase } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowRight2 } from "iconsax-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function InvestmentCard({
  item,
  onMutate,
}: {
  item: Investment;
  onMutate: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Card key={item?.id} className="w-[350px] rounded-xl">
      <CardContent className="space-y-4 px-6 py-4">
        <p className="font-medium">{item?.name}</p>
        <Separator className="border-b bg-transparent" />
        <div className="rounded-xl bg-secondary p-4">
          <span className="text-xs">{t("Total Profit")}</span>
          <p className="font-bold text-primary">
            {item?.profit} {item?.currency?.toUpperCase()}
          </p>
        </div>
        <div className="flex justify-between">
          <div>
            <span className="text-xs">{t("Invested")}</span>
            <p className="text-sm font-semibold">
              {item?.amountInvested} {item?.currency?.toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs">
              {startCase(item?.durationType)} {t("Profit")}
            </span>
            <p className="text-sm font-semibold">{item?.interestRate}%</p>
          </div>
        </div>
        <Separator className="border-b bg-transparent" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">{t("Withdraw After Matured")}</span>
            <span className="text-sm font-semibold">
              {item?.withdrawAfterMatured ? t("Yes") : t("No")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">{t("Profit Adjust")}</span>
            <span className="text-sm font-semibold">
              {startCase(item?.durationType)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">{t("Start Date")}</span>
            <span className="text-sm font-semibold">
              {item?.createdAt && format(item?.createdAt, "dd MMM yyyy")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">{t("End Date")}</span>
            <span className="text-sm font-semibold">
              {item?.endsAt && format(item?.endsAt, "dd MMM yyyy")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">{t("Duration")}</span>
            <span className="text-sm font-semibold">
              {item?.duration} {item?.duration > 1 ? t("Days") : t("Day")}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-4">
        <WithdrawConfirmation item={item} onMutate={onMutate} />
        <InvestedDetailsModal item={item} />
      </CardFooter>
    </Card>
  );
}

function WithdrawConfirmation({
  item,
  onMutate,
}: {
  item: Investment;
  onMutate: () => void;
}) {
  const { t } = useTranslation();
  const isWithdrawDisabled = new Date() < new Date(item?.endsAt);

  const handleWithdraw = () => {
    toast.promise(withdrawInvestment(item?.id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        onMutate();
        return t("Investment withdrawn successfully");
      },
      error: (err) => err.message,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="default"
          disabled={isWithdrawDisabled && !!item.withdrawAfterMatured}
          className="w-full"
        >
          {t("Withdraw")}
          <ArrowRight2 size={20} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Confirm Withdrawal")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              "Are you sure you want to proceed? This action is irreversible and will permanently withdraw your investment.",
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleWithdraw}>
            {t("Continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
