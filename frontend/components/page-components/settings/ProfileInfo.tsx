"use client";

import { Case } from "@/components/common/Case";
import { DatePicker } from "@/components/common/form/DatePicker";
import { FileInput } from "@/components/common/form/FileInput";
import { InputTelNumber } from "@/components/common/form/InputTel";
import { Loader } from "@/components/common/Loader";
import { ImageIcon } from "@/components/icons/ImageIcon";
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
import Label from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateCustomerProfileInformation } from "@/data/customers/settings/updateCustomerProfileInformation";
import { imageURL, startCase } from "@/lib/utils";
import { ImageSchema } from "@/schema/file-schema";
import type { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import React, { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const ProfileInfoSchema = z.object({
  profileImage: ImageSchema,
  firstName: z.string({ required_error: "First name is required." }),
  lastName: z.string({ required_error: "Last name is required." }),
  email: z.string({ required_error: "Email is required." }),
  phone: z.string({ required_error: "Phone is required." }),
  dateOfBirth: z.date({ required_error: "Date of Birth is required." }),
  gender: z.string({ required_error: "Sex is required" }),
});

type TProfileInfoFormData = z.infer<typeof ProfileInfoSchema>;

export function ProfileInfo({
  user,
  isLoading,
}: {
  user: User | null;
  isLoading: boolean;
  error?: any;
}) {
  const [isPending, startTransition] = useTransition();

  const { t } = useTranslation();

  const form = useForm<TProfileInfoFormData>({
    resolver: zodResolver(ProfileInfoSchema),
    defaultValues: {
      profileImage: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: undefined,
      gender: "",
    },
  });

  const userMemo = useMemo(() => user, [user]);

  const initializeForm = React.useCallback(() => {
    if (userMemo) {
      form.reset({
        firstName: userMemo?.firstName || "",
        lastName: userMemo?.lastName || "",
        email: userMemo?.email || "",
        phone: userMemo?.phone || "",
        dateOfBirth: userMemo?.dateOfBirth || undefined,
        gender: userMemo?.gender || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // Update form values when user data changes
  React.useEffect(() => {
    initializeForm();
  }, [initializeForm]);

  const onSubmit = (values: TProfileInfoFormData) => {
    startTransition(async () => {
      const res = await updateCustomerProfileInformation({
        ...values,
        gender: values.gender?.toLowerCase(),
      });
      if (res && res.status) {
        toast.success(res.message);
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
          value="PROFILE_INFORMATION"
          className="border-none px-4 py-0"
        >
          <AccordionTrigger className="py-6 hover:no-underline">
            <p className="text-base font-medium leading-[22px]">
              {t("Profile")}
            </p>
          </AccordionTrigger>

          <AccordionContent className="flex flex-col gap-6 border-t border-divider px-1 py-4">
            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Profile picture")}</FormLabel>

                  <FormControl>
                    <FileInput
                      id="profileImage"
                      defaultValue={imageURL(user?.avatar as string)}
                      onChange={(file) => {
                        field.onChange(file);
                      }}
                      className="flex aspect-square h-[160px] w-[160px] items-center justify-center border-dashed border-primary bg-transparent"
                    >
                      <div className="flex flex-col items-center gap-2.5">
                        <ImageIcon />
                        <p className="text-sm font-normal text-primary">
                          {t("Upload photo")}
                        </p>
                      </div>
                    </FileInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormLabel>{t("First name")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Full name")}
                        className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormLabel>{t("Last name")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Full name")}
                        className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      disabled
                      value={field.value}
                      placeholder={t("Enter your email")}
                      className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Phone")}</FormLabel>
                  <FormControl>
                    <InputTelNumber
                      value={field.value}
                      onChange={(phone) => field.onChange(phone)}
                      onBlur={(err) => {
                        if (err) {
                          form.setError("phone", {
                            type: "custom",
                            message: t(err),
                          });
                        } else form.clearErrors("phone");
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Date of birth")}</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Sex")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      className="flex"
                    >
                      <Label
                        htmlFor="GenderMale"
                        data-selected={startCase(field.value) === "Male"}
                        className="relative h-12 flex-1 rounded-xl border-2 border-transparent bg-muted p-4 hover:cursor-pointer hover:bg-primary-selected data-[selected=true]:border-primary data-[selected=true]:bg-primary-selected"
                      >
                        <RadioGroupItem
                          id="GenderMale"
                          value="Male"
                          className="absolute opacity-0"
                        />
                        <span>{t("Male")}</span>
                      </Label>

                      <Label
                        htmlFor="GenderFemale"
                        data-selected={startCase(field.value) === "Female"}
                        className="relative h-12 flex-1 rounded-xl border-2 border-transparent bg-muted p-4 hover:cursor-pointer hover:bg-primary-selected data-[selected=true]:border-primary data-[selected=true]:bg-primary-selected"
                      >
                        <RadioGroupItem
                          id="GenderFemale"
                          value="Female"
                          className="absolute opacity-0"
                        />
                        <span>{t("Female")}</span>
                      </Label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row items-center justify-end gap-4">
              <Button disabled={isPending}>
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
            </div>
          </AccordionContent>
        </AccordionItem>
      </form>
    </Form>
  );
}
