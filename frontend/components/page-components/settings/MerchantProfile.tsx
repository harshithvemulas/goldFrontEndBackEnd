"use client";

import { Case } from "@/components/common/Case";
import { CountrySelection } from "@/components/common/form/CountrySelection";
import { FileInput } from "@/components/common/form/FileInput";
import { Loader } from "@/components/common/Loader";
import { ImageIcon } from "@/components/icons/ImageIcon";
import {
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
import { updateMerchant } from "@/data/settings/updateMerchant";
import { imageURL } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { mutate } from "swr";
import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
];

const FileSchema = z
  .any()
  .optional()
  .refine((file) => {
    return !file || file.size <= MAX_UPLOAD_SIZE;
  }, "File size must be less than 5MB")
  .refine((file) => {
    return !file || ACCEPTED_FILE_TYPES.includes(file.type);
  }, "File must be a png, jpg, jpeg, webp");

const MerchantProfileSchema = z.object({
  profile: FileSchema,
  merchant_name: z.string({ required_error: "Merchant name is required." }),
  merchant_email: z.string({ required_error: "Merchant email is required." }),
  merchant_id: z.string({ required_error: "Merchant ID is required." }),
  // address
  street: z.string({ required_error: "Street is required" }),
  country: z.string({ required_error: "Country is required" }),
  city: z.string({ required_error: "City is required" }),
  zipCode: z.string({ required_error: "Zip code is required" }),
});

type TMerchantProfileData = z.infer<typeof MerchantProfileSchema>;

export function MerchantProfile({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const { t } = useTranslation();

  // form instance
  const form = useForm<TMerchantProfileData>({
    resolver: zodResolver(MerchantProfileSchema),
    defaultValues: {
      profile: "",
      merchant_name: "John doe",
      merchant_email: "something@example.com",
      merchant_id: "24223423422",
      street: "",
      country: "",
      city: "",
      zipCode: "",
    },
  });

  // initialize form data
  React.useEffect(() => {
    if (data) {
      form.reset({
        merchant_name: data.name,
        merchant_email: data.email,
        merchant_id: data.merchantId,
        street: data.address?.addressLine,
        country: data.address?.countryCode,
        city: data.address?.city,
        zipCode: data.address?.zipCode,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onSubmit = (values: TMerchantProfileData) => {
    startTransition(async () => {
      const res = await updateMerchant(values);
      if (res && res.status) {
        mutate("/merchants/detail");
        toast.success(res.message);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-xl border border-border bg-background"
      >
        <AccordionItem value="STORE_PROFILE" className="border-none px-4 py-0">
          <AccordionTrigger className="py-6 hover:no-underline">
            <p className="text-base font-medium leading-[22px]">
              {t("Store Profile")}
            </p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-6 border-t border-divider px-1 py-4">
            <FormField
              control={form.control}
              name="profile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Store profile picture")}</FormLabel>
                  <FormControl>
                    <FileInput
                      defaultValue={imageURL(data?.storeProfileImage)}
                      id="documentFrontSideFile"
                      onChange={(file) => field.onChange(file)}
                      className="flex aspect-square h-[160px] w-[160px] items-center justify-center border-dashed border-primary bg-transparent"
                    >
                      <div className="flex flex-col items-center gap-2.5">
                        <ImageIcon />
                        <p className="text-sm font-normal text-primary">
                          {t("Upload photo")}
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
              name="merchant_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Merchant name")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t("Merchant name")}
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
              name="merchant_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Merchant email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("Enter your email")}
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
              name="merchant_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Merchant ID")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled
                      placeholder={t("Enter Merchant ID")}
                      className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Label>{t("Merchant address")}</Label>
            <div className="grid grid-cols-12 gap-2.5">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Full name")}
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
                      <div className="relative flex items-center gap-2.5">
                        <Input
                          type="text"
                          placeholder={t("City")}
                          className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                          {...field}
                        />
                      </div>
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
                      <Input
                        type="text"
                        placeholder={t("Zip code")}
                        className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
  );
}
