"use client";

import { AuthPageHeading } from "@/app/(auth)/_components/heading";
import { Case } from "@/components/common/Case";
import { PasswordInput } from "@/components/common/form/PasswordInput";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Separator from "@/components/ui/separator";
import { resetPassword } from "@/data/auth/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2, TickCircle } from "iconsax-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  password: z
    .string({ required_error: "Password is required." })
    .min(1, "Password is required."),

  confirmPassword: z
    .string({ required_error: "Password is required." })
    .min(1, "Password is required."),
});

type TFormData = z.infer<typeof formSchema>;

export default function ResetPassword() {
  const [showStatus, setStatus] = React.useState(false);
  const [, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const { t } = useTranslation();

  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: TFormData) => {
    const token = searchParams.get("token") ?? "";

    startTransition(async () => {
      const res = await resetPassword({
        password: values.password,
        passwordConfirmation: values.confirmPassword,
        token,
      });

      if (res && res.status) {
        toast.success(res.message);
        setStatus(res.status);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  return (
    <div className="container mt-10 w-full max-w-[716px] px-4 py-6">
      <AuthPageHeading
        title={t("Reset your password")}
        subTitle={t("Congrats! Your account has been recovered")}
      />

      <div className="my-6 flex h-[5px] items-center">
        <Separator className="bg-divider" />
      </div>
      <Case condition={!showStatus}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Create new password")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("Create a strong password")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t("Confirm password")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("Enter the password again")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button className="w-[286px] px-4 py-2 text-base font-medium leading-[22px]">
                {t("Update password")}
                <ArrowRight2 size={19} />
              </Button>
            </div>
          </form>
        </Form>
      </Case>

      <Case condition={showStatus}>
        <Alert className="border-0 bg-background p-3 shadow-default">
          <TickCircle
            size="16"
            color="#107C10"
            variant="Bold"
            className="-mt-0.5"
          />
          <AlertTitle className="text-sm font-semibold leading-5 text-foreground">
            {t("Password reset successful")}
          </AlertTitle>
          <AlertDescription className="py-1.5 text-sm font-normal leading-5">
            {t(
              "We’ve reset your password. Please sign in again with your new password to continue.",
            )}
          </AlertDescription>
        </Alert>

        <div className="mt-6 flex justify-end">
          <Button
            asChild
            className="w-[286px] px-4 py-2 text-base font-medium leading-[22px]"
          >
            <Link href="/signin" prefetch={false}>
              {t("Sign in")}
              <ArrowRight2 size={19} />
            </Link>
          </Button>
        </div>
      </Case>
    </div>
  );
}
