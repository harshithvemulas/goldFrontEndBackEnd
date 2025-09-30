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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useTransactionDetails } from "@/data/mpay/getTransactionDetails";
import { verifyPayment } from "@/data/mpay/verifyPayment";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  otp: z
    .string({ required_error: "Verification code is required." })
    .min(4, "Verification code is required"),
  token: z.string(),
  trxId: z.string(),
});

type TFormData = z.infer<typeof formSchema>;

export default function OtpPay() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const trxId = searchParams.get("trxId");
  const token = searchParams.get("token");
  const { data, isLoading } = useTransactionDetails({ trxId: trxId! });
  const { t } = useTranslation();
  const router = useRouter();

  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      token: token || "",
      trxId: trxId!,
    },
  });

  const onSubmit = (values: TFormData) => {
    startTransition(async () => {
      const res = await verifyPayment(values);
      if (res && res.status) {
        router.push(`/mpay/review?trxId=${trxId}&status=completed`);
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
              name="otp"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Code")}</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={4}
                      containerClassName="w-full"
                      {...field}
                    >
                      <InputOTPGroup className="w-full gap-2">
                        <InputOTPSlot
                          index={0}
                          className="h-12 flex-1 rounded-lg"
                        />
                        <InputOTPSlot
                          index={1}
                          className="h-12 flex-1 rounded-lg"
                        />
                        <InputOTPSlot
                          index={2}
                          className="h-12 flex-1 rounded-lg"
                        />
                        <InputOTPSlot
                          index={3}
                          className="h-12 flex-1 rounded-lg"
                        />
                      </InputOTPGroup>
                    </InputOTP>
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
                  {t("Make Payment")}
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
