"use client";

import MpayFooter from "@/app/mpay/_components/mpay-footer";
import MpayHead from "@/app/mpay/_components/mpay-head";
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
import { useTransactionDetails } from "@/data/mpay/getTransactionDetails";
import { sendOtp } from "@/data/mpay/sendOtp";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string({ required_error: "Email address is required" })
    .email({ message: "Invalid email address." }),
  trxId: z.string(),
});

type TFormData = z.infer<typeof formSchema>;

export default function OtpPay() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const trxId = searchParams.get("trxId");
  const { data, isLoading } = useTransactionDetails({ trxId: trxId! });
  const { t } = useTranslation();
  const router = useRouter();

  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      trxId: trxId!,
    },
  });

  const onSubmit = (values: TFormData) => {
    startTransition(async () => {
      const res = await sendOtp(values);
      if (res && res.status) {
        router.push(`/mpay/confirm-payment?trxId=${trxId}&token=${res.token}`);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  if (isLoading) return <GlobalLoader />;

  return (
    <div>
      <MpayHead data={data} />
      <div className="mt-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="email"
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

            <div className="flex justify-end">
              <Button className="w-[286px]" type="submit" disabled={isPending}>
                <Case condition={isPending}>
                  <Loader />
                </Case>

                <Case condition={!isPending}>
                  {t("Send OTP")}
                  <ChevronRight size={19} />
                </Case>
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <MpayFooter data={data} />
    </div>
  );
}
