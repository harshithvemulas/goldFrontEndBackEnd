"use client";

import { AuthPageHeading } from "@/app/(auth)/_components/heading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Separator from "@/components/ui/separator";
import {
  agentInfoFormSchema,
  TAgentInfoFormSchema,
} from "@/schema/registration-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IProps {
  title: string;
  subTitle: string;
  onPrev: () => void;
  onSubmit: (values: TAgentInfoFormSchema) => void;
  nextButtonLabel?: string;
  formData: Record<string, unknown>;
}

export function AgentInformationForm({
  onPrev,
  onSubmit,
  title,
  subTitle,
  nextButtonLabel,
  formData,
}: IProps) {
  const { t } = useTranslation();

  const form = useForm<TAgentInfoFormSchema>({
    resolver: zodResolver(agentInfoFormSchema),
    defaultValues: {
      name: "",
      occupation: "",
      whatsapp: "",
    },
  });

  React.useEffect(() => {
    if (formData?.agent) {
      form.reset({ ...formData.agent });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AuthPageHeading {...{ title, subTitle }} />

        <div className="my-6 flex h-[5px] items-center">
          <Separator className="bg-divider" />
        </div>

        <div className="flex flex-col gap-6">
          {/* Merchant name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Agent name")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t("Enter agent name")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Job / Occupation")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t("Enter your job")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("WhatsApp Number / Link")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t(
                      "Enter your WhatsApp account number or link",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" type="button" onClick={onPrev}>
              <ArrowLeft2 size={24} />
              {t("Back")}
            </Button>

            <Button
              type="submit"
              className="w-[286px] text-base font-medium leading-[22px]"
            >
              {nextButtonLabel}
              <ArrowRight2 size={16} />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
