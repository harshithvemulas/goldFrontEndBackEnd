"use client";

import * as React from "react";

import { AuthPageHeading } from "@/app/(auth)/_components/heading";
import { Case } from "@/components/common/Case";
import { CountrySelection } from "@/components/common/form/CountrySelection";
import { Loader } from "@/components/common/Loader";
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
import Label from "@/components/ui/label";
import Separator from "@/components/ui/separator";
import {
  merchantInfoFormSchema,
  TMerchantInfoFormSchema,
} from "@/schema/registration-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IProps {
  title: string;
  subTitle: string;
  onPrev: () => void;
  onSubmit: (values: TMerchantInfoFormSchema) => void;
  nextButtonLabel?: string;
  isLoading?: boolean;
  formData: Record<string, unknown>;
}

export function MerchantInformationForm({
  title,
  subTitle,
  onPrev,
  onSubmit,
  nextButtonLabel,
  isLoading = false,
  formData,
}: IProps) {
  const { t } = useTranslation();

  const form = useForm<TMerchantInfoFormSchema>({
    resolver: zodResolver(merchantInfoFormSchema),
    defaultValues: {
      name: "",
      email: "",
      license: "",
      street: "",
      country: "",
      city: "",
      zipCode: "",
    },
  });

  React.useEffect(() => {
    if (formData?.merchant) {
      form.reset({ ...formData.merchant });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderInputField = React.useCallback(
    (
      name: keyof TMerchantInfoFormSchema,
      label: string,
      type: "text" | "email" | "password" = "text",
      placeholder?: string,
    ) => (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label ? <FormLabel>{label}</FormLabel> : null}
            <FormControl>
              <Input
                type={type}
                placeholder={placeholder || t(`Enter ${label.toLowerCase()}`)}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    [form.control, t],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AuthPageHeading {...{ title, subTitle }} />

        <div className="my-6 flex h-[5px] items-center">
          <Separator className="bg-divider" />
        </div>

        <div className="flex flex-col gap-6">
          {/* Merchant name */}
          {renderInputField("name", t("Merchant name"))}
          {renderInputField("email", t("Merchant email"), "email")}
          {renderInputField(
            "license",
            t("Merchant proof"),
            "text",
            t("Enter merchant license or register number"),
          )}

          {/* address */}
          <div className="grid grid-cols-12 gap-4">
            <Label className="col-span-12">{t("Merchant address")}</Label>
            <div className="col-span-12">
              {renderInputField("street", "", "text", t("Address line"))}
            </div>
            <div className="col-span-12">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CountrySelection
                        onSelectChange={(country) =>
                          field.onChange(country.code.cca2)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              {renderInputField("city", "", "text", t("City"))}
            </div>
            <div className="col-span-12 md:col-span-6">
              {renderInputField("zipCode", "", "text", t("Zip Code"))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              className="p-4 text-base leading-[22px]"
              variant="outline"
              type="button"
              onClick={onPrev}
            >
              <ArrowLeft2 size={24} />
              {t("Back")}
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-[286px] p-4 text-base leading-[22px]"
            >
              <Case condition={!isLoading}>
                {nextButtonLabel}
                <ArrowRight2 size={16} />
              </Case>
              <Case condition={isLoading}>
                <Loader className="text-background" />
              </Case>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
