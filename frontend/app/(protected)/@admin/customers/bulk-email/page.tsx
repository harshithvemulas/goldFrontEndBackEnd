"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendBulkMail } from "@/data/admin/sendBulkMail";
import { useTableData } from "@/hooks/useTableData";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight2 } from "iconsax-react";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  ids: z.array(z.number({ required_error: "CC is required" })),
  subject: z.string({ required_error: "Subject is required" }),
  message: z.string({ required_error: "Message is required" }),
});

type TFormData = z.infer<typeof formSchema>;

export default function BulkEmail() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const { data, isLoading } = useTableData(
    `/admin/merchants?${searchParams.toString()}&search=${search}`,
    { keepPreviousData: true },
  );

  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ids: [],
      subject: "",
      message: "",
    },
  });

  const onSubmit = (values: TFormData) => {
    startTransition(async () => {
      const res = await sendBulkMail(values);
      if (res.status) {
        toast.success(res.message);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="rounded-xl border border-border bg-background">
        <div className="border-none px-4 py-0">
          <div className="py-6 hover:no-underline">
            <div className="flex items-center gap-1">
              <p className="text-base font-medium leading-[22px]">
                {t("Send an email to")} {searchParams.get("name")}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6 border-t border-divider px-1 py-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="box-border flex h-fit flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="ids"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>{t("CC")}</FormLabel>

                      <FormControl>
                        <Drawer direction="right">
                          <DrawerTrigger className="flex h-12 w-full items-center rounded-lg bg-input px-3 py-2 text-left text-base font-normal">
                            {field.value.length === 0 ? (
                              <span className="text-input-placeholder">
                                {t("CC")}
                              </span>
                            ) : (
                              <span>
                                {data
                                  ?.filter((c: Record<string, any>) =>
                                    field.value?.includes(c.id),
                                  )
                                  ?.map((c: Record<string, any>) => c.name)
                                  ?.join(", ")}
                              </span>
                            )}
                          </DrawerTrigger>
                          <DrawerContent className="inset-x-auto inset-y-0 bottom-auto left-auto right-0 top-0 m-0 flex h-full w-[95%] flex-col rounded-t-none bg-white px-0 py-8 md:w-[400px]">
                            {/* Header */}
                            <div className="flex items-center gap-2.5 px-6">
                              <DrawerClose asChild>
                                <Button size="icon" variant="outline">
                                  <ArrowLeft />
                                </Button>
                              </DrawerClose>
                              <div>
                                <DrawerTitle> {t("Customer")} </DrawerTitle>
                                <DrawerDescription className="text-sm text-secondary-text">
                                  {t("Select users to send mail")}
                                </DrawerDescription>
                              </div>
                            </div>

                            {/* Body */}
                            <div className="flex flex-col gap-4 pt-5">
                              <div className="px-6">
                                <Input
                                  type="text"
                                  placeholder={t("Search...")}
                                  value={search}
                                  onChange={(e) => setSearch(e.target.value)}
                                />
                              </div>
                              <Case condition={isLoading}>
                                <div className="px-6">
                                  <Loader />
                                </div>
                              </Case>
                              <Case condition={data?.length !== 0}>
                                {data?.map((customer: Record<string, any>) => (
                                  <div
                                    key={customer.id}
                                    className="mx-3 flex items-center gap-4 rounded-md px-2.5 py-2 hover:bg-accent"
                                  >
                                    <Avatar className="rounded-md">
                                      <AvatarImage src="" />
                                      <AvatarFallback className="rounded-md font-medium">
                                        {getAvatarFallback(customer?.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <h6>{customer?.name}</h6>
                                      <span className="block text-sm text-secondary-text">
                                        email: {customer?.email}
                                      </span>
                                    </div>
                                    <Checkbox
                                      checked={field.value.includes(
                                        customer?.id,
                                      )}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          const d = [
                                            ...field.value,
                                            customer.id,
                                          ];
                                          field.onChange(d);
                                        } else {
                                          field.onChange([
                                            ...field.value.filter(
                                              (d: any) => d !== customer.id,
                                            ),
                                          ]);
                                        }
                                      }}
                                    />
                                  </div>
                                ))}
                              </Case>
                            </div>
                          </DrawerContent>
                        </Drawer>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="subject"
                  control={form.control}
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>{t("Subject")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Subject of your mail...")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="message"
                  control={form.control}
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>{t("Message")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("Write a message here...")}
                          rows={10}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-end gap-4">
                  <Button disabled={isPending} className="rounded-xl">
                    {isPending ? (
                      <Loader
                        title={t("Sending..")}
                        className="text-primary-foreground"
                      />
                    ) : (
                      <>
                        {t("Send")}
                        <ArrowRight2 size={16} />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
