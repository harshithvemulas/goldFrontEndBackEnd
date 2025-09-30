"use client";

import { TWithdrawFormSchema } from "@/app/(protected)/@customer/withdraw/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WithdrawAgentMethod } from "@/types/withdraw-method";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IProps {
  form: UseFormReturn<TWithdrawFormSchema>;
  name: string;
  avatar?: string;
  agentId: string;
  commission: string;
  phoneNumber?: string;
  processingTime: string;
  paymentMethods?: WithdrawAgentMethod[];
  onSelect: (method: string) => void;
}

export function AgentCard({
  form,
  name,
  avatar,
  agentId,
  commission,
  phoneNumber,
  processingTime,
  paymentMethods,
  onSelect,
}: IProps) {
  const { t } = useTranslation();

  const methodError = form.getFieldState("method")?.error?.message;

  React.useEffect(() => {
    if (form.getValues("method")) {
      form.clearErrors("method");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getValues("method")]);

  return (
    <Card>
      <CardContent className="px-4 py-4 text-foreground sm:px-6">
        <div className="mb-6 flex items-center gap-2">
          <Avatar className="size-10 border">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{getAvatarFallback(name)}</AvatarFallback>
          </Avatar>

          <span className="font-bold">{name}</span>
        </div>

        <div className="mb-8 grid grid-cols-12 gap-2 text-sm">
          <div className="col-span-6 sm:col-span-6">
            <p className="opacity-70">{t("Agent ID")}</p>
            <p className="font-medium">{agentId}</p>
          </div>

          <div className="col-span-6 sm:col-span-6">
            <p className="opacity-70">{t("Phone")}</p>
            <p className="font-medium">{phoneNumber}</p>
          </div>

          <div className="col-span-6 sm:col-span-6">
            <p className="opacity-70">{t("Commission")}</p>
            <p className="font-medium">{commission ?? 0}%</p>
          </div>

          {processingTime ? (
            <div className="col-span-6 sm:col-span-6">
              <p className="opacity-70">{t("Processing Time")}</p>
              <p className="font-medium">{processingTime}</p>
            </div>
          ) : null}
        </div>

        <Select onValueChange={onSelect}>
          <SelectTrigger className="data-[placeholder]:text-placeholder capitalize">
            <SelectValue placeholder={t("Select payment gateway")} />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods
              ?.filter((m) => Boolean(m.active) && Boolean(m.allowWithdraw))
              ?.map((method) => (
                <SelectItem
                  key={method.id}
                  value={method.name}
                  className="capitalize"
                >
                  {method.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {methodError ? (
          <span className="mt-2 block text-sm text-destructive">
            {methodError}
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}
