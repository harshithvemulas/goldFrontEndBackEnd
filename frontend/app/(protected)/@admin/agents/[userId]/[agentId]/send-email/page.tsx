"use client";

import { Loader } from "@/components/common/Loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendMail } from "@/data/admin/sendMail";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import { useParams, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  subject: z.string({ required_error: "User Key is required" }),
  message: z.string({ required_error: "User Secret is required" }),
});

type TFormData = z.infer<typeof formSchema>;

export default function APIMobileMoney() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const params = useParams();

  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const onSubmit = (values: TFormData) => {
    startTransition(async () => {
      const res = await sendMail(values, params.userId as string);
      if (res.status) toast.success(res.message);
      else toast.error(t(res.message));
    });
  };

  return (
    <Accordion type="multiple" defaultValue={["API"]}>
      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-xl border border-border bg-background">
          <AccordionItem value="API" className="border-none px-4 py-0">
            <AccordionTrigger className="py-6 hover:no-underline">
              <div className="flex items-center gap-1">
                <p className="text-base font-medium leading-[22px]">
                  {t("Send an email to")} {searchParams.get("name")}
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-6 border-t border-divider px-1 pt-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    name="subject"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Subject")}</FormLabel>
                        <Input
                          type="text"
                          placeholder={t("Subject of your mail...")}
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="message"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Message")}</FormLabel>
                        <Textarea
                          placeholder={t("Write a message here...")}
                          rows={10}
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-end gap-4">
                    <Button disabled={isPending} className="rounded-xl">
                      {isPending ? (
                        <Loader
                          title={t("Sending...")}
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
            </AccordionContent>
          </AccordionItem>
        </div>
      </div>
    </Accordion>
  );
}
