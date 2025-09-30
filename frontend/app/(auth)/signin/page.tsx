"use client";

import { AuthPageHeading } from "@/app/(auth)/_components/heading";
import { Case } from "@/components/common/Case";
import { PasswordInput } from "@/components/common/form/PasswordInput";
import LoaderIcon from "@/components/icons/LoaderIcon";
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
import Separator from "@/components/ui/separator";
import { authSignIn } from "@/data/auth/login";
import { useBranding } from "@/hooks/useBranding";
import { type TLoginFormData, LoginFormSchema } from "@/schema/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    siteName,
    customerRegistration,
    merchantRegistration,
    agentRegistration,
  } = useBranding();

  const [error, setError] = useState("");

  const enabledRegistrations = [
    { type: "customer", enabled: customerRegistration },
    { type: "merchant", enabled: merchantRegistration },
    { type: "agent", enabled: agentRegistration },
  ];

  const enabledCount = enabledRegistrations.filter((r) => r.enabled).length;

  const form = useForm<TLoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleErrors = (res: any) => {
    if (res.statusCode >= 422) {
      const errorMessage = t(
        "The credentials you entered are incorrect. Please check your email and password, and try again.",
      );
      toast.error(t("Incorrect Credentials"));
      setError(errorMessage);
    } else if (res.statusCode >= 400 && res.statusCode < 500) {
      const errorMessage = t(res.message);
      toast.error(t(res.message) || t("Incorrect Credentials"));
      setError(errorMessage);
    } else if (res.statusCode >= 500) {
      const serverErrorMessage =
        t(res.message) ||
        t("An unexpected error occurred. Please try again later.");
      toast.error(serverErrorMessage);
      setError(serverErrorMessage);
    }
  };

  const onSubmit = (values: TLoginFormData) => {
    startTransition(async () => {
      const res = await authSignIn(values);

      if (res && res?.redirectURL) {
        router.push(res.redirectURL);
      }

      if (res?.token) {
        router.push(`/signin/2fa?token=${res.token}`);
      } else {
        handleErrors(res);
      }
    });
  };

  return (
    <div className="container mt-10 flex max-w-2xl flex-1 flex-col py-6">
      <AuthPageHeading
        title={t("Sign in")}
        subTitle={t("Welcome to {{siteName}}", { siteName })}
      />

      <div className="my-6 flex h-[5px] items-center">
        <Separator className="bg-divider" />
      </div>

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
                <FormLabel required>{t("Email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="placeholder:text-placeholder"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("Password")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t("Enter your password")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              prefetch={false}
              className="text-primary hover:underline"
            >
              {t("Forgot password?")}
            </Link>
          </div>

          {error === "" ? null : (
            <div className="rounded-lg bg-destructive/10 px-4 py-3">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          <div className="flex justify-end">
            <Button className="sm:w-52" disabled={isPending}>
              <Case condition={!isPending}>
                {t("Sign in")}
                <ChevronRight size={19} />
              </Case>
              <Case condition={isPending}>
                <LoaderIcon />
                {t("Processing...")}
              </Case>
            </Button>
          </div>
        </form>
      </Form>

      <div className="block md:hidden">
        <Case condition={enabledCount > 0}>
          <div className="mt-6 flex w-full items-center justify-center gap-1 py-6 sm:hidden">
            <span>{t("Have an account?")}</span>
            <Button
              type="button"
              variant="link"
              className="m-0 p-0 text-primary hover:underline"
            >
              <Link href="/register" prefetch={false}>
                {t("Sign up")}
              </Link>
            </Button>
          </div>
        </Case>
      </div>
    </div>
  );
}
