import { AuthPageHeading } from "@/app/(auth)/_components/heading";
import { InputTelNumber } from "@/components/common/form/InputTel";
import { PasswordInput } from "@/components/common/form/PasswordInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useAuth } from "@/hooks/useAuth";
import {
  customerRegistrationFormSchema,
  type TCustomerRegistrationFormSchema,
} from "@/schema/registration-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { CountryCode } from "libphonenumber-js";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function RegistrationForm({
  onPrev,
  onSubmit,
  title,
  subTitle,
  formData,
}: {
  title: string;
  subTitle: string;
  onPrev: () => void;
  onSubmit: (values: TCustomerRegistrationFormSchema) => void;
  formData: Record<string, unknown>;
}) {
  const { t } = useTranslation();
  const sp = useSearchParams();
  const { deviceLocation } = useAuth();

  const form = useForm<TCustomerRegistrationFormSchema>({
    resolver: zodResolver(customerRegistrationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      referralCode: "",
      termAndCondition: undefined,
    },
  });

  React.useEffect(() => {
    if (formData) {
      form.reset({ ...formData });
    }

    if (sp.get("referral")) {
      form.setValue("referralCode", (sp.get("referral") as string) ?? "");
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
          <div className="grid grid-cols-12 gap-4">
            {/* First name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-6">
                  <FormLabel>{t("First Name")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t("Enter first name")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-6">
                  <FormLabel>{t("Last Name")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t("Enter last name")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email  */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("Enter your email address")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("Phone")}</FormLabel>
                <FormControl>
                  <InputTelNumber
                    onChange={field.onChange}
                    onBlur={(error: string) => {
                      if (error) {
                        form.setError("phone", {
                          type: "custom",
                          message: error,
                        });
                      } else {
                        form.clearErrors("phone");
                      }
                    }}
                    options={{
                      initialCountry:
                        deviceLocation?.countryCode as CountryCode,
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password  */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Password")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t("Create a strong password")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Confirm Password")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t("Enter the password again")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referralCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Referral (optional)")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("Enter referral code (if applicable)")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="termAndCondition"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="termAndCondition"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label
                      className="text-sm font-normal leading-5 text-foreground"
                      htmlFor="termAndCondition"
                    >
                      {t(
                        "I read and accept the general terms & conditions of use",
                      )}
                    </Label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={onPrev}
              className="h-10 w-[102px] text-base font-medium leading-[22px] text-foreground"
            >
              <ArrowLeft2 size="24" />
              {t("Back")}
            </Button>

            <Button
              type="submit"
              className="w-[286px] rounded-[8px] px-4 py-2 text-base font-medium leading-[22px]"
            >
              {t("Next")}
              <ArrowRight2 size="16" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
