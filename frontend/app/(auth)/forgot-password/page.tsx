"use client";

import { AuthPageHeading } from "@/app/(auth)/_components/heading";
import { Case } from "@/components/common/Case";
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
import Separator from "@/components/ui/separator";
import { forgotPassword } from "@/data/auth/login";
import { useBranding } from "@/hooks/useBranding";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string({ required_error: "Email address is required" })
    .email({ message: "Invalid email address." }),
});

type TFormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useTranslation();
  const { siteName } = useBranding();

  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: TFormData) => {
    startTransition(async () => {
      const res = await forgotPassword(values);
      if (res && res.status) {
        router.push(`/forgot-password/mail-send?email=${values.email}`);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  return (
    <div className="container mt-10 max-w-2xl py-6">
      <AuthPageHeading
        title={t("Forgot password? Don't worry")}
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
                <FormLabel>{t("Email")}</FormLabel>
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
                {t("Recover account")}
                <ChevronRight size={19} />
              </Case>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
