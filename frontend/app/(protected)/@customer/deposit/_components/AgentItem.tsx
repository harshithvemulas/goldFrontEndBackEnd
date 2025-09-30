"use client";

import { TDepositFormData } from "@/app/(protected)/@customer/deposit/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { startCase } from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { ArrowDown2, ArrowRight2 } from "iconsax-react";
import Image from "next/image";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IProps {
  onNext: () => void;
  agent: any;
  form: UseFormReturn<TDepositFormData>;
}

export function AgentItem({ onNext, form, agent }: IProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectMethod, setSelectMethod] = useState<Record<string, any>>();

  const methodError = form.getFieldState("method")?.error?.message;

  React.useEffect(() => {
    if (form.getValues("method")) {
      form.clearErrors("method");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getValues("method")]);

  return (
    <div className="space-y-6 rounded-xl px-6 py-4 shadow-default">
      <div className="flex flex-col justify-between md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          {/* avatar */}
          <Avatar>
            <AvatarImage src={agent?.profileImage} />
            <AvatarFallback> {getAvatarFallback(agent?.name)} </AvatarFallback>
          </Avatar>

          <p className="text-sm font-bold">{agent?.name}</p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="w-full md:w-auto">
            <span className="mb-1 text-[10px]">{t("Phone number")}</span>
            <div className="flex items-center gap-2">
              <Image
                src={`https://flagcdn.com/${agent?.address?.countryCode?.toLowerCase()}.svg`}
                alt={t("france flag")}
                width={64}
                height={64}
                className="h-4 w-6"
              />
              <p className="text-sm leading-6">
                {agent?.user?.customer?.phone}
              </p>
            </div>
          </div>
          <div className="flex-1 md:flex-auto">
            <span className="mb-1 text-[10px]">{t("Agent ID")}</span>
            <p className="text-sm leading-6">{agent?.agentId}</p>
          </div>
          <div className="flex-1 md:flex-auto">
            <span className="mb-1 text-[10px]">{t("Charges")}</span>
            <p className="text-sm leading-6">
              {agent?.depositCharge ? `${agent?.depositCharge}%` : t("Free")}
            </p>
          </div>
          <div className="flex-1 md:flex-auto">
            <span className="mb-1 text-[10px]">{t("Processing time")}</span>
            <p className="text-sm leading-6">
              {agent?.processingTime} {t("Hours")}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-end gap-2 sm:flex-row">
        <div className="flex w-full flex-col">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="flex h-10 w-full items-center justify-between gap-2 rounded bg-secondary px-4 text-sm font-medium text-secondary-foreground transition duration-300 ease-in-out hover:bg-accent">
              {selectMethod ? (
                <span> {startCase(selectMethod?.name)} </span>
              ) : (
                <span>{t("Select a method")}</span>
              )}
              <ArrowDown2 size={16} />
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
              <Command>
                <CommandList>
                  <CommandEmpty />
                  <CommandGroup>
                    {agent?.agentMethods ? (
                      agent?.agentMethods?.map((method: any) => (
                        <CommandItem
                          key={method.id}
                          onSelect={() => {
                            setSelectMethod(method);
                            form.setValue("method", method?.name?.toString());
                            form.setValue("agent", agent?.agentId?.toString());
                            setOpen(false);
                          }}
                          disabled={!method.active}
                        >
                          {selectMethod?.id === method?.id && (
                            <ArrowRight2 variant="Bold" />
                          )}
                          {startCase(method?.name)}
                        </CommandItem>
                      ))
                    ) : (
                      <span>{t("No available methods")}</span>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {methodError ? (
            <span className="mt-2 block text-sm text-destructive">
              {methodError}
            </span>
          ) : null}
        </div>
        <Button type="button" onClick={onNext} className="min-w-48">
          <span>{t("Next")}</span>
          <ArrowRight2 size={16} />
        </Button>
      </div>
    </div>
  );
}
