"use client";
"use client";

import { Case } from "@/components/common/Case";
import { FileInput } from "@/components/common/form/FileInput";
import { Loader } from "@/components/common/Loader";
import { ImageIcon } from "@/components/icons/ImageIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Switch from "@/components/ui/switch";
import { updateSiteSettings } from "@/data/admin/site-settings/updateSiteSettings";
import { useCurrencies } from "@/data/useCurrencies";
import { useBranding } from "@/hooks/useBranding";
import { imageURL } from "@/lib/utils";
import { FaviconSchema, ImageSchema } from "@/schema/file-schema";
import { Currency } from "@/types/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const SiteSettingsSchema = z.object({
  logo: ImageSchema,
  favicon: FaviconSchema,
  authBanner: ImageSchema,
  cardBg: ImageSchema,
  siteName: z.string({ required_error: "Site name is required." }),
  siteUrl: z.string({ required_error: "Site Url is required." }),
  apiUrl: z.string({ required_error: "API Url is required." }),
  defaultCurrency: z.string({
    required_error: "Default currency is required.",
  }),
  defaultLanguage: z.string({
    required_error: "Default language is required.",
  }),
  referralBonusAmount: z.string(),
  referralBonusReceiver: z.string(),
  referralApplyOn: z.string(),
  customerRegistration: z.boolean().default(false),
  agentRegistration: z.boolean().default(false),
  merchantRegistration: z.boolean().default(false),
});

export type TSiteSettingsSchema = z.infer<typeof SiteSettingsSchema>;

export default function SiteSettings() {
  const {
    logo,
    favicon,
    authBanner,
    cardBg,
    siteName,
    siteUrl,
    apiUrl,
    defaultCurrency,
    defaultLanguage,
    referral,
    customerRegistration,
    agentRegistration,
    merchantRegistration,
  } = useBranding();

  const { currencies, isLoading } = useCurrencies();
  const [isPending, startTransition] = useTransition();

  const { t } = useTranslation();

  const form = useForm<TSiteSettingsSchema>({
    resolver: zodResolver(SiteSettingsSchema),
    defaultValues: {
      logo: "",
      favicon: "",
      authBanner: "",
      cardBg: "",
      siteName: "",
      siteUrl: "",
      apiUrl: "",
      defaultCurrency,
      defaultLanguage,
      referralBonusAmount: referral?.bonusAmount || "",
      referralBonusReceiver: referral?.bonusReceiver || "",
      referralApplyOn: referral?.applyOn || "",
      customerRegistration: !!customerRegistration,
      agentRegistration: !!agentRegistration,
      merchantRegistration: !!merchantRegistration,
    },
  });

  // Update form values when user data changes
  React.useEffect(() => {
    form.reset({
      logo: logo || "",
      favicon: favicon || "",
      authBanner: authBanner || "",
      cardBg: cardBg || "",
      siteName,
      siteUrl,
      apiUrl,
      defaultCurrency,
      defaultLanguage,
      referralBonusAmount: referral?.bonusAmount || "",
      referralBonusReceiver: referral?.bonusReceiver,
      referralApplyOn: referral?.applyOn || "",
      customerRegistration: !!customerRegistration,
      agentRegistration: !!agentRegistration,
      merchantRegistration: !!merchantRegistration,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    logo,
    favicon,
    authBanner,
    cardBg,
    siteName,
    siteUrl,
    apiUrl,
    defaultCurrency,
    defaultLanguage,
  ]);

  const onSubmit = (values: TSiteSettingsSchema) => {
    startTransition(async () => {
      const res = await updateSiteSettings(values);
      if (res && res.status) {
        toast.success(res.message);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  return (
    <Accordion type="multiple" defaultValue={["SITE_INFORMATION"]}>
      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-xl border border-border bg-background"
          >
            <AccordionItem
              value="SITE_INFORMATION"
              className="border-none px-4 py-0"
            >
              <AccordionTrigger className="py-6 hover:no-underline">
                <p className="text-base font-medium leading-[22px]">
                  {t("Site Info")}
                </p>
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-6 border-t border-divider px-1 py-4">
                <div className="flex gap-10">
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Site Logo")}</FormLabel>

                        <FormControl>
                          <FileInput
                            id="logo"
                            defaultValue={imageURL(logo)}
                            onChange={(file) => {
                              field.onChange(file);
                            }}
                            className="flex aspect-square h-[160px] w-[160px] items-center justify-center border-dashed border-primary bg-transparent"
                          >
                            <div className="flex flex-col items-center gap-2.5">
                              <ImageIcon />
                              <p className="text-sm font-normal text-primary">
                                {t("Upload logo")}
                              </p>
                            </div>
                          </FileInput>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="favicon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Favicon")}</FormLabel>

                        <FormControl>
                          <FileInput
                            id="favicon"
                            defaultValue={imageURL(favicon)}
                            onChange={(file) => {
                              field.onChange(file);
                            }}
                            className="flex aspect-square h-[160px] w-[160px] items-center justify-center border-dashed border-primary bg-transparent"
                          >
                            <div className="flex flex-col items-center gap-2.5">
                              <ImageIcon />
                              <p className="text-sm font-normal text-primary">
                                {t("Upload favicon")}
                              </p>
                            </div>
                          </FileInput>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="authBanner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Sign In Page Banner")}</FormLabel>

                        <FormControl>
                          <FileInput
                            id="authBanner"
                            defaultValue={imageURL(authBanner)}
                            onChange={(file) => {
                              field.onChange(file);
                            }}
                            className="flex aspect-square h-[160px] w-[160px] items-center justify-center border-dashed border-primary bg-transparent"
                          >
                            <div className="flex flex-col items-center gap-2.5">
                              <ImageIcon />
                              <p className="text-sm font-normal text-primary">
                                {t("Upload banner")}
                              </p>
                            </div>
                          </FileInput>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cardBg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Card Background")}</FormLabel>

                        <FormControl>
                          <FileInput
                            id="cardBg"
                            defaultValue={imageURL(cardBg)}
                            onChange={(file) => {
                              field.onChange(file);
                            }}
                            className="flex aspect-square h-[160px] w-[160px] items-center justify-center border-dashed border-primary bg-transparent"
                          >
                            <div className="flex flex-col items-center gap-2.5">
                              <ImageIcon />
                              <p className="text-sm font-normal text-primary">
                                {t("Upload background")}
                              </p>
                            </div>
                          </FileInput>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-6">
                      <FormLabel>{t("Site Name")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Enter Site Name")}
                          className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="siteUrl"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-6">
                      <FormLabel>{t("Site Url")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Enter Site Url")}
                          className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apiUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("API Url")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          disabled
                          value={field.value}
                          placeholder={t("Enter API Url")}
                          className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="referralBonusReceiver"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Referral Bonus Receiver")}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="flex"
                        >
                          <Label
                            htmlFor="referrer"
                            data-selected={field.value === "referrer"}
                            className="relative h-12 flex-1 rounded-xl border-2 border-transparent bg-muted p-4 hover:cursor-pointer hover:bg-primary-selected data-[selected=true]:border-primary data-[selected=true]:bg-primary-selected"
                          >
                            <RadioGroupItem
                              id="referrer"
                              value="referrer"
                              className="absolute opacity-0"
                            />
                            <span>{t("Referrer")}</span>
                          </Label>

                          <Label
                            htmlFor="both"
                            data-selected={field.value === "both"}
                            className="relative h-12 flex-1 rounded-xl border-2 border-transparent bg-muted p-4 hover:cursor-pointer hover:bg-primary-selected data-[selected=true]:border-primary data-[selected=true]:bg-primary-selected"
                          >
                            <RadioGroupItem
                              id="both"
                              value="both"
                              className="absolute opacity-0"
                            />
                            <span>{t("Both")}</span>
                          </Label>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="referralBonusAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Referral Bonus Amount")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Enter referral bonus amount")}
                          className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="referralApplyOn"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Apply Referral")}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="disabled:bg-input">
                            <SelectValue placeholder={t("Select referral")} />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              { name: t("Verify email"), key: "verify_email" },
                              { name: t("KYC"), key: "kyc" },
                              {
                                name: t("First deposit"),
                                key: "first_deposit",
                              },
                            ]?.map((option: any) => (
                              <SelectItem key={option.key} value={option.key}>
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="defaultCurrency"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Default Currency")}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="disabled:bg-input">
                            <SelectValue placeholder={t("Select currency")} />
                          </SelectTrigger>
                          <SelectContent>
                            {!isLoading &&
                              currencies?.map((currency: Currency) => (
                                <SelectItem
                                  key={currency.code}
                                  value={currency.code}
                                >
                                  {currency.code}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="defaultLanguage"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Default Language")}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="disabled:bg-input">
                            <SelectValue placeholder={t("Select language")} />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              { name: "English", code: "en" },
                              { name: "French", code: "fr" },
                            ]?.map((lang: any) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="customerRegistration"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-auto flex flex-row items-center gap-2">
                      <Label className="space-y-auto m-0 mb-0 mt-2 h-auto w-[230px] py-0 text-sm font-semibold">
                        {t("Customer Registration")}
                      </Label>
                      <FormControl>
                        <Switch
                          defaultChecked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="agentRegistration"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-auto flex flex-row items-center gap-2">
                      <Label className="space-y-auto m-0 mb-0 mt-2 h-auto w-[230px] py-0 text-sm font-semibold">
                        {t("Agent Registration")}
                      </Label>
                      <FormControl>
                        <Switch
                          defaultChecked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="merchantRegistration"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-auto flex flex-row items-center gap-2">
                      <Label className="space-y-auto m-0 mb-0 mt-2 h-auto w-[230px] py-0 text-sm font-semibold">
                        {t("Merchant Registration")}
                      </Label>
                      <FormControl>
                        <Switch
                          defaultChecked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-row items-center justify-end gap-4">
                  <Button disabled={isPending}>
                    <Case condition={!isPending}>
                      {t("Save")}
                      <ArrowRight2 size={20} />
                    </Case>
                    <Case condition={isPending}>
                      <Loader
                        title={t("Processing...")}
                        className="text-primary-foreground"
                      />
                    </Case>
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </form>
        </Form>
      </div>
    </Accordion>
  );
}
