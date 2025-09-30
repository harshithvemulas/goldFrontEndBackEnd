"use client";

import { Case } from "@/components/common/Case";
import { CountrySelection } from "@/components/common/form/CountrySelection";
import { Loader } from "@/components/common/Loader";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { updateCustomerMailingAddress } from "@/data/customers/settings/updateCustomerMailingAddress";
import { useCountries } from "@/data/useCountries";
import type { TAddress } from "@/types/address";
import { Country } from "@/types/country";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  street: z.string({ required_error: "Street is required." }),
  country: z.string({ required_error: "Country is required." }),
  city: z.string({ required_error: "city is required." }),
  zipCode: z.string({ required_error: "Zip code is required." }),
});

type TFormData = z.infer<typeof FormSchema>;

export function AddressInfo({ address }: { address: TAddress }) {
  const [isPending, startTransition] = useTransition();
  const [country, setCountry] = React.useState<Country | null>(null);
  const { getCountryByCode } = useCountries();

  const { t } = useTranslation();

  const form = useForm<TFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      street: "",
      city: "",
      country: "",
      zipCode: "",
    },
  });

  // Update form values when user data changes
  React.useEffect(() => {
    if (address) {
      getCountryByCode(address.countryCode?.toLowerCase(), setCountry);

      form.reset({
        street: address.addressLine,
        city: address.city,
        country: address.countryCode,
        zipCode: address.zipCode,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  // update user mailing address
  const updateMailingAddress = (formData: TFormData) => {
    startTransition(async () => {
      const res = await updateCustomerMailingAddress(formData);
      if (res && res.status) {
        toast.success(res.message);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(updateMailingAddress)}
        className="rounded-xl border border-border bg-background"
      >
        <AccordionItem
          value="ADDRESS_INFORMATION"
          className="border-none px-4 py-0"
        >
          <AccordionTrigger className="py-6 hover:no-underline">
            <p className="text-base font-medium leading-[22px]">
              {t("Address")}
            </p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2 border-t border-divider px-1 pt-4">
            <Label>{t("Full mailing address")}</Label>
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
                      <div className="relative flex items-center gap-2.5">
                        <Input
                          type="text"
                          placeholder={t("City name")}
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
