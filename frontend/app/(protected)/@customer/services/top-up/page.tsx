"use client";

import { Case } from "@/components/common/Case";
import { InputTelNumber } from "@/components/common/form/InputTel";
import { SelectWallet } from "@/components/common/form/SelectWallet";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useServices } from "@/hooks/useServices";
import { shapePhoneNumber } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { type CountryCode } from "libphonenumber-js";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  walletId: z.string().min(1, "Please select a wallet"),
  topUpAmount: z.string().min(1, "Amount is required."),
  topUpNumber: z.string().min(1, "Phone number is required."),
});

export type TopUpFormData = z.infer<typeof formSchema>;

function TopUpPage() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const { auth } = useAuth();
  const { createTopUpRequest } = useServices();

  const router = useRouter();
  const searchParams = useSearchParams();

  const customerCountryCode = auth?.customer?.address?.countryCode;

  const form = useForm<TopUpFormData>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      walletId: "",
      topUpAmount: "",
      topUpNumber: "",
    },
  });

  // handle top-up request
  const onSubmit = (formData: TopUpFormData) => {
    startTransition(async () => {
      const amount = Number(formData?.topUpAmount);

      const response = await createTopUpRequest({
        data: {
          number: formData?.topUpNumber,
          countryCode: customerCountryCode ?? "",
          amount: !Number.isNaN(amount) ? amount : 0,
          currencyCode: formData?.walletId,
        },
      });

      if (response?.status) {
        toast.success(response.message);
        router.push("/services/top-up/success");
      } else {
        toast.error(response.message);
      }
    });
  };

  useEffect(() => {
    if (searchParams.has("phone")) {
      form.setValue(
        "topUpNumber",
        shapePhoneNumber(searchParams.get("phone") as string),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-full p-4 pb-10 md:p-12">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Wallet list */}
              <div>
                <h2 className="mb-4">{t("Select wallet")}</h2>
                <FormField
                  name="walletId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectWallet
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h2 className="mb-4">{t("How much?")}</h2>
                <FormField
                  control={form.control}
                  name="topUpAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t("Enter recharge amount")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Enter phone number */}
              <div>
                <h2 className="mb-4">{t("Enter phone number")}</h2>
                <FormField
                  control={form.control}
                  name="topUpNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputTelNumber
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={(errorMessage: string) => {
                            form.setError("topUpNumber", {
                              type: "custom",
                              message: errorMessage,
                            });
                          }}
                          options={{
                            initialCountry: customerCountryCode as CountryCode,
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <Button
                  variant="outline"
                  type="button"
                  className="order-2 flex w-full gap-0 px-4 py-2 text-base font-medium text-foreground sm:order-1 sm:w-fit"
                  asChild
                >
                  <Link href="/services">
                    <ArrowLeft2 size={24} /> {t("Back")}
                  </Link>
                </Button>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="order-1 flex w-full gap-0 rounded-lg px-4 py-2 text-base font-medium leading-[22px] sm:order-2 sm:w-[286px]"
                >
                  <Case condition={!isPending}>
                    {t("Confirm and Recharge")}
                    <ArrowRight2 size="16" />
                  </Case>

                  <Case condition={isPending}>
                    <Loader
                      title={t("Processing...")}
                      className="text-primary-foreground"
                    />
                  </Case>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default TopUpPage;
