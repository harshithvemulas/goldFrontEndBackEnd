import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Separator from "@/components/ui/separator";
import { Investment } from "@/data/investments/activeInvestments";
import { startCase } from "@/lib/utils";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export default function InvestedDetailsModal({ item }: { item: Investment }) {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full">
          {t("View details")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{item?.name}</DialogTitle>
        </DialogHeader>
        <div className="rounded-xl bg-secondary p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs">{t("Total Profit")}</span>
              <p className="font-bold text-primary">
                {item?.profit} {item?.currency?.toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs">{t("Amount Invested")}</span>
              <p className="font-bold text-primary">
                {item?.amountInvested} {item?.currency?.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs">
                {startCase(item?.durationType)} {t("Profit")}
              </span>
              <p className="font-bold text-primary">{item?.interestRate}%</p>
            </div>
            <div className="text-right">
              <span className="text-xs">{t("Profit Adjust")}</span>
              <p className="font-bold text-primary">
                {startCase(item?.durationType)}
              </p>
            </div>
          </div>
        </div>
        <Separator className="border-b bg-transparent" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">{t("Profit Adjust")}</span>
            <span className="text-sm font-semibold">
              {startCase(item?.durationType)}
            </span>
          </div>
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
      </DialogContent>
    </Dialog>
  );
}
