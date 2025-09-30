"use client";

import { Loader } from "@/components/common/Loader";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import Separator from "@/components/ui/separator";
import { updateUserBalance } from "@/data/admin/updateUserBalance";
import { updateWalletTransferLimit } from "@/data/admin/updateWalletTransferLimit";
import { Wallet } from "@/types/wallet";
import { More } from "iconsax-react";
import React, { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function BalanceInfo({
  wallets,
  onMutate,
}: {
  wallets: any;
  onMutate: () => void;
}) {
  const { t } = useTranslation();
  return (
    <AccordionItem
      value="BALANCE"
      className="rounded-xl border border-border bg-background px-4 py-0"
    >
      <AccordionTrigger className="py-6 hover:no-underline">
        <p className="text-base font-medium leading-[22px]">{t("Balance")}</p>
      </AccordionTrigger>
      <AccordionContent className="grid grid-cols-12 gap-4 border-t pt-4">
        {wallets?.map((item: any) => (
          <BalanceCard key={item.id} item={item} onMutate={onMutate} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function BalanceCard({ item, onMutate }: { item: any; onMutate: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="relative col-span-12 flex flex-col gap-2 rounded-xl border border-border bg-accent p-6 text-accent-foreground sm:col-span-6 md:col-span-4 lg:col-span-3">
      <div className="absolute right-1 top-1 flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:bg-secondary-text/30 active:bg-secondary-text/50"
            >
              <More strokeWidth={3} size={17} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col rounded-sm" align="end">
            <AddBalance
              wallet={item}
              userId={item?.userId}
              onMutate={onMutate}
            />
            <RemoveBalance
              wallet={item}
              userId={item?.userId}
              onMutate={onMutate}
            />
            <TransferLimit wallet={item} onMutate={onMutate} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <span className="text-xs font-normal leading-4">
        {item.currency.code}
      </span>
      <h6 className="text-sm font-semibold leading-5">
        {item.balance} {item.currency.code}
      </h6>
      {item?.dailyTransferAmount ? (
        <div className="flex items-center gap-1">
          <span className="text-xs font-normal leading-4">
            {t("Daily transfer limit")}:
          </span>
          <h6 className="text-xs font-normal leading-4">
            {item?.dailyTransferAmount} {item.currency.code}
          </h6>
        </div>
      ) : null}
    </div>
  );
}

// add balance
function AddBalance({
  userId,
  wallet,
  onMutate,
}: {
  userId: number;
  wallet: Wallet;
  onMutate: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState({
    amount: "0",
    currencyCode: wallet?.currency.code,
    userId,
    keepRecords: true,
  });

  const reset = () => {
    setFormData({
      amount: "0",
      currencyCode: wallet?.currency.code,
      userId,
      keepRecords: true,
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await updateUserBalance(
      {
        amount: Number(formData.amount),
        currencyCode: formData.currencyCode,
        userId: formData.userId,
        keepRecords: formData.keepRecords,
      },
      "add",
    );

    if (res.status) {
      toast.success(res.message);
      onMutate();
      setIsLoading(false);
      setOpen(false);
    } else {
      toast.error(res.message);
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(checked) => {
        setOpen(checked);
        reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex h-8 cursor-pointer select-none items-center justify-start rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
        >
          {t("Add balance")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-semibold">
            {t("Add Balance")}
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        <Separator />

        <div>
          <form onSubmit={onSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <Label className="text-sm"> {t("Balance")} </Label>
              <Input
                type="number"
                value={formData.amount}
                min={0}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, amount: e.target.value }))
                }
              />
            </div>

            <Label className="flex items-center gap-2.5 text-sm">
              <Checkbox
                checked={formData.keepRecords}
                onCheckedChange={(checked: boolean) =>
                  setFormData((p) => ({
                    ...p,
                    keepRecords: checked,
                  }))
                }
              />
              <span>{t("Keep in record")}</span>
            </Label>

            <div className="flex items-center justify-end gap-2.5">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isLoading}>
                {isLoading ? (
                  <Loader
                    title={t("Uploading...")}
                    className="text-primary-foreground"
                  />
                ) : (
                  t("Update")
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// remove balance
function RemoveBalance({
  userId,
  wallet,
  onMutate,
}: {
  userId: number;
  wallet: Wallet;
  onMutate: () => void;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState({
    amount: "0",
    currencyCode: wallet?.currency.code,
    userId,
    keepRecords: true,
  });

  const reset = () => {
    setFormData({
      amount: "0",
      currencyCode: wallet?.currency.code,
      userId,
      keepRecords: true,
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await updateUserBalance(
      {
        amount: Number(formData.amount),
        currencyCode: formData.currencyCode,
        userId: formData.userId,
        keepRecords: formData.keepRecords,
      },
      "remove",
    );

    if (res.status) {
      reset();
      onMutate();
      setOpen(false);
      setIsLoading(false);
      toast.success(res.status);
    } else {
      setIsLoading(false);
      toast.error(res.status);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(checked) => {
        setOpen(checked);
        reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex h-8 cursor-pointer select-none items-center justify-start rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
        >
          {t("Remove balance")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-semibold">
            {t("Remove Balance")}
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        <Separator />

        <div>
          <form onSubmit={onSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <Label className="text-sm"> {t("Balance")} </Label>
              <Input
                type="number"
                value={formData.amount}
                min={0}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, amount: e.target.value }))
                }
              />
            </div>

            <Label className="flex items-center gap-2.5 text-sm">
              <Checkbox
                checked={formData.keepRecords}
                onCheckedChange={(checked: boolean) =>
                  setFormData((p) => ({
                    ...p,
                    keepRecords: checked,
                  }))
                }
              />
              <span>{t("Keep in record")}</span>
            </Label>

            <div className="flex items-center justify-end gap-2.5">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  {t("Cancel")}
                </Button>
              </DialogClose>
              <Button disabled={isLoading}>
                {isLoading ? (
                  <Loader
                    title={t("Uploading...")}
                    className="text-primary-foreground"
                  />
                ) : (
                  t("Update")
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// remove balance
function TransferLimit({
  wallet,
  onMutate,
}: {
  wallet: any;
  onMutate: () => void;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const [fieldData, setFieldData] = React.useState<string | number>(
    wallet?.dailyTransferAmount,
  );

  const reset = () => {
    setFieldData(fieldData || 0);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      dailyTransferAmount: Number(fieldData),
    };

    const res = await updateWalletTransferLimit(data, wallet?.id);

    if (res.status) {
      reset();
      onMutate();
      setOpen(false);
      setIsLoading(false);
      onMutate();
      toast.success(res.status);
    } else {
      setIsLoading(false);
      toast.error(res.status);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(checked) => {
        setOpen(checked);
        reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex h-8 cursor-pointer select-none items-center justify-start rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
        >
          {t("Transfer limit")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-semibold flex items-center gap-4">
            {t("Transfer amount limit")}
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        <Separator />

        <div>
          <form onSubmit={onSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <Label className="text-sm"> {t("Daily transfer amount")} </Label>
              <Input
                type="string"
                value={fieldData}
                min={0}
                onChange={(e) => setFieldData(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  {t("Cancel")}
                </Button>
              </DialogClose>
              <Button disabled={isLoading}>
                {isLoading ? (
                  <Loader
                    title={t("Uploading...")}
                    className="text-primary-foreground"
                  />
                ) : (
                  t("Update")
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
