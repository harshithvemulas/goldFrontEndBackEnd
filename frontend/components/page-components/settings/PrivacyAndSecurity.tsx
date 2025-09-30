"use client";

import { Case } from "@/components/common/Case";
import { PasswordInput } from "@/components/common/form/PasswordInput";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Loader } from "@/components/common/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { changeCurrentPassword } from "@/data/auth/changePassword";
import { ArrowLeft2, ArrowRight2, Lock } from "iconsax-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const formSchema = z
  .object({
    currentPassword: z.string({
      required_error: "Current password is required.",
    }),
    newPassword: z.string({ required_error: "Choose a new password" }),
    confirmPassword: z.string({
      required_error: "Confirm password is required.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New Password must be different",
    path: ["newPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export function PrivacyAndSecurity() {
  const { t } = useTranslation();
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: FormData) => {
    startTransition(async () => {
      const res = await changeCurrentPassword(values);
      if (res && res.status) {
        toast.success(t("Password successfully updated"));
      } else {
        toast.error(t(res.message));
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-xl border border-border bg-background"
      >
        <AccordionItem
          value="PASSWORD_INFORMATION"
          className="border-none px-4 py-0"
        >
          <AccordionTrigger className="py-6 hover:no-underline">
            <p className="text-base font-medium leading-[22px]">
              {t("Privacy & Security")}
            </p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-6 border-t border-divider px-1 pt-4">
            <Alert className="border-none bg-transparent shadow-default">
              <Lock color="#0B6A0B" variant="Bulk" />
              <AlertTitle className="pl-2 text-sm font-semibold leading-5">
                {t("Two-factor authentication is on.")}
              </AlertTitle>
              <AlertDescription className="pl-2 text-sm font-normal">
                {t(
                  "To ensure maximum security, two-factor authentication is always on by default. You will have to verify your email each time you log in.",
                )}
              </AlertDescription>
            </Alert>

            <Case condition={!isEditMode}>
              <FormField
                control={form.control}
                name="currentPassword"
                render={() => (
                  <FormItem>
                    <FormLabel>{t("Password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        defaultValue="akdjfkjsdfjkdsf"
                        readOnly
                        disabled={!isEditMode}
                        placeholder={t("Full name")}
                        className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Case>

            <Case condition={isEditMode}>
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Current password")}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t("Enter current password")}
                        className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                        disabled={!isEditMode}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("New Password")}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        disabled={!isEditMode}
                        className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                        placeholder={t("Create a strong password")}
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
                    <FormLabel>{t("Confirm New Password")}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        disabled={!isEditMode}
                        className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                        placeholder={t("Enter the password again")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Case>

            <div className="flex flex-row items-center justify-end gap-4">
              <Case condition={!isEditMode}>
                <Button type="button" onClick={() => setIsEditMode(true)}>
                  {t("Edit Password")}
                  <ArrowRight2 size={20} />
                </Button>
              </Case>

              <Case condition={isEditMode}>
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditMode(false)}
                  >
                    <ArrowLeft2 size={20} />
                    {t("Cancel")}
                  </Button>

                  <Button type="submit" disabled={isPending}>
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
                </>
              </Case>
            </div>
          </AccordionContent>
        </AccordionItem>
      </form>
    </Form>
  );
}
