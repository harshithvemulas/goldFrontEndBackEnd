"use client";

import { Case } from "@/components/common/Case";
import { CountrySelection } from "@/components/common/form/CountrySelection";
import { Loader } from "@/components/common/Loader";
import { ImageIcon } from "@/components/icons/ImageIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  merchantInfoFormSchema,
  TMerchantInfoFormSchema,
} from "@/schema/registration-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft2, ArrowRight2, Warning2 } from "iconsax-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IProps {
  onPrev: () => void;
  onSubmit: (values: TMerchantInfoFormSchema) => void;
  nextButtonLabel?: string;
  isLoading?: boolean;
}

export function MerchantInfoForm({
  onPrev,
  onSubmit,
  nextButtonLabel,
  isLoading = false,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          {/* Merchant name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Merchant name")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="placeholder:font-normal"
                    placeholder={t("Enter merchant name")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Merchant email  */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Merchant email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("Enter your merchant email address")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Merchant license  */}
          <FormField
            control={form.control}
            name="license"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between gap-4">
                  {t("Merchant proof")}
                  {/* Help Dialog */}
                  <Dialog>
                    <DialogTrigger
                      className="inline-flex items-center gap-1"
                      asChild
                    >
                      <Button type="button" variant="ghost" size="sm">
                        {t("Help")}
                        <Warning2 size={16} />
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("Dialog title")}</DialogTitle>
                        <DialogDescription>
                          {t(
                            "Make changes to your profile here. Click save when youre done.",
                          )}
                        </DialogDescription>
                      </DialogHeader>

                      <div>
                        <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-neutral-200">
                          <ImageIcon />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t("Enter merchant license or register number")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* address */}
          <div className="grid grid-cols-12 gap-4">
            <Label className="col-span-12">{t("Merchant address")}</Label>
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
                <FormItem className="col-span-6">
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
                <FormItem className="col-span-6">
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
