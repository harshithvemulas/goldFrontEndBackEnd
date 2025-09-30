"use client";

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
import { updateMerchantProfile } from "@/data/admin/updateMerchantProfile";
import { useCountries } from "@/data/useCountries";
import { imageURL } from "@/lib/utils";
import { Address } from "@/types/address";
import { Country } from "@/types/country";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const FileSchema = z
  .any()
  .optional()
  .refine((file) => {
    return !file || file.size <= MAX_UPLOAD_SIZE;
  }, "File size must be less than 5MB")
  .refine((file) => {
    return !file || ACCEPTED_FILE_TYPES.includes(file.type);
  }, "File must be a PNG, JPG, JPEG");

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

interface IProps {
  merchant?: {
    id: any;
    storeImage: any;
    name: any;
    email: any;
    merchantId: any;
    userId: string | number;
    address: Address;
  };
  onMutate: () => void;
  isLoading?: boolean;
}

export function MerchantProfile({
  merchant,
  onMutate,
  isLoading = false,
}: IProps) {
  const [isPending, startTransaction] = React.useTransition();
  const [country, setCountry] = React.useState<Country | null>();
  const { getCountryByCode } = useCountries();

  const { t } = useTranslation();

  const form = useForm<TMerchantProfileData>({
    resolver: zodResolver(MerchantProfileSchema),
    defaultValues: {
      profile: "",
      merchant_name: "",
      merchant_email: "",
      merchant_id: "",
      street: "",
      country: "",
      city: "",
      zipCode: "",
    },
  });

  // initial form data
  const init = useCallback(() => {
    if (merchant) {
      getCountryByCode(merchant.address.countryCode, setCountry);
      form.reset({
        merchant_name: merchant.name,
        merchant_email: merchant.email,
        merchant_id: merchant.merchantId,
        street: merchant.address?.addressLine,
        country: merchant.address?.countryCode,
        city: merchant.address?.city,
        zipCode: merchant.address?.zipCode,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  useEffect(() => init(), [init]);

  const onSubmit = (values: TMerchantProfileData) => {
    startTransaction(async () => {
      const res = await updateMerchantProfile(
        values,
        merchant?.userId as string,
      );
      if (res?.status) {
        onMutate();
        toast.success(res.message);
      } else toast.error(t(res.message));
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
                      id="documentFrontSideFile"
                      defaultValue={imageURL(merchant?.storeImage)}
                      onChange={(file) => {
                        field.onChange(file);
                      }}
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
                        defaultValue={country}
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
                      <Input
                        type="text"
                        placeholder={t("City")}
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
                {isPending ? (
                  <Loader
                    title={t("Updating...")}
                    className="text-primary-foreground"
                  />
                ) : (
                  <>
                    {t("Save")}
                    <ArrowRight2 size={20} />
                  </>
                )}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </form>
    </Form>
  );
}
