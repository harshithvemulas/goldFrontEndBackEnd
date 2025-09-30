"use client";

import { Case } from "@/components/common/Case";
import GlobalLoader from "@/components/common/GlobalLoader";
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
import { useMerchantDetails } from "@/data/mpay/getMerchantDetails";
import { initQr } from "@/data/mpay/initQr";
import { configs } from "@/lib/configs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  customerName: z.string(),
  customerEmail: z
    .string({ required_error: "Email address is required" })
    .email({ message: "Invalid email address." }),
  amount: z.string(),
  currency: z.string(),
  feeByCustomer: z.boolean(),
  merchantId: z.string(),
});

type TFormData = z.infer<typeof formSchema>;

export default function Qrform() {
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId");
  const router = useRouter();
  const { data, isLoading } = useMerchantDetails({ merchantId: merchantId! });
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      amount: "",
      currency: "",
      merchantId: merchantId!,
      feeByCustomer: true,
    },
  });
  const onSubmit = (values: TFormData) => {
    startTransition(async () => {
      const res = await initQr(values);
      if (res && res.success) {
        router.push(res.redirectUrl);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  if (isLoading) return <GlobalLoader />;
  return (
    <div>
      <div className="mb-3 flex flex-col items-center">
        {data?.storeProfileImage && (
          <Image
            src={`${configs?.STATIC_URL}/${data?.storeProfileImage}`}
            alt="Merchant Logo"
            className="mb-3"
            width={200}
            height={80}
          />
        )}
        <h2>{t("Pay")}</h2>
        <p>
          <span className="text-slate-500">{t("to")}</span> {data?.name}
        </p>
      </div>
      <hr />
      <div className="mt-3">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Enter your name")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Enter your full name")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Enter your email")}</FormLabel>
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
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Enter your amount")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("Enter your amount")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Enter your currency")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("USD/EUR/NGN")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button className="w-full" type="submit" disabled={isPending}>
                  <Case condition={isPending}>
                    <Loader />
                  </Case>

                  <Case condition={!isPending}>
                    {t("Confirm")}
                    <ChevronRight size={19} />
                  </Case>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-slate-500">
          {t("For any issues please contact at")}{" "}
          <a href={`mailto:${data?.email}`} className="text-blue-500">
            {data?.email}
          </a>
        </p>
      </div>
    </div>
  );
}
