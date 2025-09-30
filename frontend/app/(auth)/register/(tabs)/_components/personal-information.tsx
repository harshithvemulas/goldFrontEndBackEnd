"use client";

import * as React from "react";

import { AuthPageHeading } from "@/app/(auth)/_components/heading";
import { Case } from "@/components/common/Case";
import { CountrySelection } from "@/components/common/form/CountrySelection";
import { DatePicker } from "@/components/common/form/DatePicker";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Separator from "@/components/ui/separator";
import {
  personalInfoFormSchema,
  TPersonalInfoFormSchema,
} from "@/schema/registration-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IProps {
  onPrev: () => void;
  onSubmit: (values: TPersonalInfoFormSchema) => void;
  nextButtonLabel?: string;
  title: string;
  subTitle: string;
  isLoading?: boolean;
  formData: Record<string, unknown>;
}

export default function PersonalInformationForm({
  onPrev,
  onSubmit,
  nextButtonLabel,
  title,
  subTitle,
  isLoading = false,
  formData,
}: IProps) {
  const { t } = useTranslation();

  const form = useForm<TPersonalInfoFormSchema>({
    resolver: zodResolver(personalInfoFormSchema),
    defaultValues: {
      title: "",
      dateOfBirth: undefined,
      street: "",
      country: "",
      city: "",
      zipCode: "",
    },
  });

  React.useEffect(() => {
    if (formData) {
      form.reset({ ...formData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AuthPageHeading title={title} subTitle={subTitle} />

        <div className="mt-6 flex h-[5px] items-center">
          <Separator className="bg-divider" />
        </div>
        <div className="flex flex-col gap-6">
          {/* What should we call you? */}
          <div className="flex flex-col space-y-2">
            <FormLabel required>{t("Select your gender")}</FormLabel>
            <div className="grid grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormControl>
                      <RadioGroup
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        className="grid-cols-12 gap-4"
                      >
                        <Label
                          htmlFor="male"
                          data-active={field.value === "male"}
                          className="col-span-12 flex h-12 w-full cursor-pointer items-center justify-start rounded-xl border-[3px] border-border bg-input-disabled p-4 transition-all duration-300 ease-in-out hover:border-primary-selected hover:bg-primary-selected data-[active=true]:border-primary data-[active=true]:bg-primary-selected md:col-span-6"
                        >
                          <RadioGroupItem
                            id="male"
                            value="male"
                            className="absolute left-0 top-0 opacity-0"
                          />
                          <span>{t("Male")}</span>
                        </Label>

                        <Label
                          htmlFor="female"
                          data-active={field.value === "female"}
                          className="col-span-12 flex h-12 cursor-pointer items-center justify-start rounded-xl border-[3px] border-border bg-input-disabled p-4 transition-all duration-300 ease-in-out hover:border-primary-selected hover:bg-primary-selected data-[active=true]:border-primary data-[active=true]:bg-primary-selected md:col-span-6"
                        >
                          <RadioGroupItem
                            id="female"
                            value="female"
                            className="absolute left-0 top-0 opacity-0"
                          />
                          <span>{t("Female")}</span>
                        </Label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Birthday  */}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Select your birth date")}</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* address */}
          <div className="grid grid-cols-12 gap-4">
            <Label className="col-span-12">
              {t("Your full mailing address")}
            </Label>
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t("Address Line")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormControl>
                    <CountrySelection
                      defaultCountry={field.value}
                      onSelectChange={(country) =>
                        field.onChange(country.code.cca2)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6">
                  <FormControl>
                    <Input type="text" placeholder={t("City")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6">
                  <FormControl>
                    <Input type="text" placeholder={t("Zip Code")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              className="border-btn-outline-border p-4 text-base font-medium leading-[22px]"
              variant="outline"
              type="button"
              onClick={onPrev}
            >
              <ArrowLeft2 size={24} />
              {t("Back")}
            </Button>

            <Button
              disabled={isLoading}
              className="w-[286px] p-4 text-base font-medium leading-[22px]"
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
