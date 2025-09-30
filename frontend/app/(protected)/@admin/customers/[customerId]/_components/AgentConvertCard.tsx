"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { HandshakeIcon } from "@/components/icons/HandshakeIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Separator from "@/components/ui/separator";
import { convertCustomerType } from "@/data/admin/convertCustomerType";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  roleId: z.number().optional(),
  name: z.string({ required_error: "Agent name is required." }),
  occupation: z.string({ required_error: "Occupation is required." }),
  whatsapp: z.string({ required_error: "Whatsapp number/link is required." }),
});

type TFormData = z.infer<typeof formSchema>;

export default function AgentConvertCard({ customer }: { customer: any }) {
  const [isPending, startTransaction] = React.useTransition();
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleId: 4,
      name: "",
      occupation: "",
      whatsapp: "",
    },
  });

  // handle form submission
  const onSubmit = (values: TFormData) => {
    startTransaction(async () => {
      const res = await convertCustomerType(
        { roleId: values.roleId, agent: values },
        customer.id,
      );

      if (res?.status) {
        setOpen(false);
        toast.success(res.message);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  return (
    <div className="flex flex-1 flex-col items-center rounded-xl border border-border bg-background px-6 py-4 sm:w-[300px]">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-spacial-red-foreground/50">
        <HandshakeIcon />
      </div>
      <Separator className="mb-1 mt-[5px] bg-border" />

      <div className="mt-2 px-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger disabled={customer?.roleId === 4} asChild>
            <Button className="rounded-xl">
              {t("Convert to Agent")}
              <ArrowRight2 size={16} />
            </Button>
          </DialogTrigger>

          <DialogContent className="flex max-w-[716px] flex-col gap-6 p-16">
            <DialogHeader className="p-0">
              <DialogTitle className="text-[32px] font-medium leading-10">
                {t("Add agent information")}
              </DialogTitle>
              <DialogDescription className="hidden" aria-hidden>
                {t("dialog description")}
              </DialogDescription>
            </DialogHeader>

            <Separator />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-y-6"
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        type="hidden"
                        aria-hidden
                        placeholder={t("Enter agent name")}
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agent Name</FormLabel>
                      <Input
                        type="text"
                        placeholder={t("Enter agent name")}
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="occupation"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Job/Occupation")}</FormLabel>
                      <Input
                        type="text"
                        placeholder={t("Enter your job/occupation")}
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="whatsapp"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("WhatsApp number/link")}</FormLabel>
                      <Input
                        type="text"
                        placeholder={t(
                          "Enter your WhatsApp account number or link",
                        )}
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => setOpen(false)}
                    type="button"
                    variant="outline"
                  >
                    <ArrowLeft2 />
                    {t("Back")}
                  </Button>

                  <Button className="w-[286px]" disabled={isPending}>
                    <Case condition={!isPending}>
                      {t("Convert")}
                      <ArrowRight2 />
                    </Case>
                    <Case condition={isPending}>
                      <Loader
                        title={t("Converting...")}
                        className="text-primary-foreground"
                      />
                    </Case>
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
