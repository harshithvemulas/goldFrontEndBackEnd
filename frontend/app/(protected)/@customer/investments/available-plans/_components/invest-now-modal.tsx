import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InvestmentPlan } from "@/data/investments/investmentPlan";
import { makeInvestmentReq } from "@/data/investments/makeInvestmentReq";
import { startCase } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const investmentSchema = z
  .object({
    amountInvested: z.coerce.number({
      required_error: "Amount invested is required",
    }),
    minAmount: z.coerce.number({
      required_error: "Minimum amount is required",
    }),
    maxAmount: z.coerce.number({
      required_error: "Maximum amount is required",
    }),
  })
  .refine((data) => data.amountInvested >= data.minAmount, {
    message: "Amount invested must be at least the minimum amount",
    path: ["amountInvested"],
  })
  .refine((data) => data.amountInvested <= data.maxAmount, {
    message: "Amount must be at most the maximum amount",
    path: ["amountInvested"],
  });

export default function InvestNowModal({
  item,
  onMutate,
}: {
  item: InvestmentPlan;
  onMutate: () => void;
}) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      amountInvested: Number(item.minAmount),
      minAmount: Number(item.minAmount),
      maxAmount: item?.isRange
        ? Number(item.maxAmount)
        : Number(item.minAmount),
    },
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      const res = await makeInvestmentReq({
        amountInvested: data.amountInvested,
        investmentPlanId: item.id,
      });

      if (res?.status) {
        toast.success(t("Investment successful!"));
        onMutate();
        setIsOpen(false);
      } else {
        toast.error(t(res?.message));
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="default"
          disabled={!item.isActive}
          className="w-full"
        >
          {t("Invest Now")}
          <ArrowRight2 size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Invest")}</DialogTitle>
        </DialogHeader>
        <div className="rounded-xl bg-primary-selected p-4">
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
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs">
                {item?.isRange ? t("Min Amount") : t("Required Amount")}
              </span>
              <p className="font-bold text-primary">
                {item?.minAmount} {item?.currency}
              </p>
            </div>
            {item?.isRange ? (
              <div className="text-right">
                <span className="text-xs">{t("Max Amount")}</span>
                <p className="font-bold text-primary">
                  {item?.maxAmount} {item?.currency}
                </p>
              </div>
            ) : null}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="amountInvested"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-6">
                  <FormLabel>{`${t("Investment Amount")} (${item?.currency})`}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={
                        item.isRange
                          ? `${item.minAmount} ${item.currency} - ${item.maxAmount} ${item.currency}`
                          : `${item.minAmount} ${item.currency}`
                      }
                      className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                {t("Cancel")}
              </Button>
              <Button type="submit">
                <Case condition={isPending}>
                  <Loader
                    title={t("Processing...")}
                    className="text-primary-foreground"
                  />
                </Case>
                <Case condition={!isPending}>{t("Invest Now")}</Case>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
