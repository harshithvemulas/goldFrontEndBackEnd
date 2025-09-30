"use client";

import { AuthPageHeading } from "@/app/(auth)/_components/heading";
import { Case } from "@/components/common/Case";
import LoaderIcon from "@/components/icons/LoaderIcon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Label from "@/components/ui/label";
import Separator from "@/components/ui/separator";
import {
  resendTwoFactorVerificationCode,
  twoFactorVerification,
} from "@/data/auth/login";
import { useAuth } from "@/hooks/useAuth";
import { useBranding } from "@/hooks/useBranding";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Refresh2, TickCircle } from "iconsax-react";
import { ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { match } from "ts-pattern";
import { z } from "zod";

const schema = z.object({
  otp: z
    .string({ required_error: "Verification code is required." })
    .min(4, "Verification code is required"),
  token: z.string().optional(),
  isRememberMe: z.boolean().default(false),
  fingerprint: z.string().optional(),
});

type TFormData = z.infer<typeof schema>;

export default function TwoFactorVerification() {
  const [resending, setResending] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { refreshAuth } = useAuth();
  const { siteName } = useBranding();

  const form = useForm<TFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: "",
      fingerprint: "",
      isRememberMe: false,
      token: searchParams.get("token") ?? "",
    },
  });

  useEffect(() => {
    const setFp = async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      form.setValue("fingerprint", visitorId);
    };

    setFp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (values: TFormData) => {
    const data = {
      ...values,
      token: values.token || searchParams.get("token") || "",
    };

    startTransition(async () => {
      const res = await twoFactorVerification(data);

      if (res && res.status) {
        refreshAuth();
        router.push("/");
        toast.success(res.message);
      } else {
        match(res)
          .with({ message: "Token is invalid" }, () => {
            toast.error(
              t(
                "Your sign-in session has timed out. Please try signing in again.",
              ),
            );
            router.push("/signin");
          })
          .with({ message: "Invalid OTP code." }, () => {
            form.setError("otp", {
              message: t(res.message),
              type: "custom",
            });
            toast.error(t(res.message));
          })
          .otherwise(() =>
            toast.error(t("An unexpected error occurred. Please try again.")),
          );
      }
    });
  };

  // resend verification code
  const resendCode = async () => {
    setResending(true);
    const res = await resendTwoFactorVerificationCode(
      searchParams.get("token") ?? "",
    );

    if (res.statusCode === 401) {
      toast.error(
        t("Your sign-in session has timed out. Please try signing in again."),
      );
      router.push("/signin");
      return;
    }

    if (res && res.status) {
      toast.success(t(res.message));
      router.push(`/signin/2fa?token=${res.token}`);
      setResending(false);
    } else {
      toast.error(t(res.message));
      router.push("/signin");
      setResending(false);
    }
  };

  return (
    <Form {...form}>
      <div className="container mt-10 max-w-2xl px-4 py-6">
        <AuthPageHeading
          title={t("Please verify it's you")}
          subTitle={t("Welcome to {{siteName}}, let's get start", { siteName })}
        />

        <div className="my-6 flex h-[5px] items-center">
          <Separator className="bg-divider" />
        </div>

        <Alert className="rounded-lg border-0 bg-background p-3 shadow-default">
          <TickCircle
            size="16"
            color="#107C10"
            variant="Bold"
            className="-mt-0.5"
          />
          <AlertTitle className="text-sm font-semibold leading-5 text-foreground">
            {t("Two-factor authentication")}
          </AlertTitle>
          <AlertDescription className="py-1.5 text-sm font-normal leading-5">
            {t(
              "We’ve sent you a 4 digit code to the email address you provided, please enter the code to verify it’s you.",
            )}
          </AlertDescription>
        </Alert>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-6"
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

          <div className="flex items-center justify-between gap-4">
            <FormField
              name="isRememberMe"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="remember"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm font-normal leading-5 hover:cursor-pointer"
                      >
                        {t("Remember this device")}
                      </Label>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={resendCode}
              disabled={resending}
              className="rounded-lg px-4 py-2 text-foreground"
            >
              <Case condition={!resending}>
                <Refresh2 size={15} />
                {t("Resend code")}
              </Case>

              <Case condition={resending}>
                <LoaderIcon />
                {t("Processing...")}
              </Case>
            </Button>

            <Button type="submit" className="w-[286px]" disabled={isPending}>
              <Case condition={!isPending}>
                {t("Verify")}
                <ChevronRight size={15} />
              </Case>

              <Case condition={isPending}>
                <LoaderIcon />
                {t("Processing...")}
              </Case>
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
}
