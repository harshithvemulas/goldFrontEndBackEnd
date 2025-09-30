"use client";

import { Loader } from "@/components/common/Loader";
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
import { updateAgentInformation } from "@/data/admin/updateAgent";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import { useParams } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

// Agent info schema
const AgentInfoSchema = z.object({
  name: z.string({ required_error: "Agent name is required." }),
  occupation: z.string({ required_error: "Occupation is required." }),
  whatsapp: z.string({ required_error: "Whatsapp is required." }),
  agentId: z.string({ required_error: "Agent ID is required." }),
  processingTime: z.string({ required_error: "Processing time is required." }),
});

type TAgentInfo = z.infer<typeof AgentInfoSchema>;

interface AgentInfo extends Record<string, any> {
  name: string;
  agentId: string;
  whatsapp: string;
  processingTime: string;
  occupation: string;
}

interface IProps<T> {
  agentInfo: T;
  onMutate: () => void;
}

/*
 * Agent Information settings form component
 */
export function AgentInfoSettings<T extends AgentInfo>({
  agentInfo,
  onMutate,
}: IProps<T>) {
  const [isPending, startTransition] = useTransition();

  const params = useParams();
  const { t } = useTranslation();

  const form = useForm<TAgentInfo>({
    resolver: zodResolver(AgentInfoSchema),
    defaultValues: {
      name: "",
      occupation: "",
      whatsapp: "",
      processingTime: "",
      agentId: "",
    },
  });

  // Agent useEffect
  React.useEffect(() => {
    if (agentInfo) {
      form.reset({
        name: agentInfo.name ?? "",
        occupation: agentInfo.occupation ?? "",
        whatsapp: agentInfo.whatsapp ?? "",
        processingTime: String(agentInfo.processingTime) ?? "",
        agentId: agentInfo.agentId ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentInfo]);

  // update agent info data
  const onSubmit = (values: TAgentInfo) => {
    const data = {
      ...values,
      email: agentInfo?.email,
      addressLine: agentInfo?.address?.addressLine,
      zipCode: agentInfo?.address?.zipCode,
      countryCode: agentInfo?.address?.countryCode,
      city: agentInfo?.address?.city,
    };

    // update agent information
    startTransition(async () => {
      const res = await updateAgentInformation(data, params?.userId as string);
      if (res.status) {
        onMutate();
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
          value="AGENT_INFORMATION"
          className="border-none px-4 py-0"
        >
          <AccordionTrigger className="py-6 hover:no-underline">
            <p className="text-base font-medium leading-[22px]">
              {t("Agent profile")}
            </p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-6 border-t px-1 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Agent name")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t("Enter your name")}
                      className="text-base font-normal disabled:cursor-auto disabled:bg-accent disabled:opacity-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Job/Occupation")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t("Enter your job")}
                      className="text-base font-normal disabled:cursor-auto disabled:bg-accent disabled:opacity-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("WhatsApp number/link")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t(
                        "Enter your WhatsApp account number or link",
                      )}
                      className="text-base font-normal disabled:cursor-auto disabled:bg-accent disabled:opacity-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Agent ID")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled
                      placeholder="1241SDFE3"
                      className="text-base font-normal disabled:cursor-auto disabled:bg-accent disabled:opacity-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="processingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Processing Time (Hours)")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t("Enter processing time")}
                      className="text-base font-normal disabled:cursor-auto disabled:bg-accent disabled:opacity-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row items-center justify-end gap-4">
              <Button>
                {isPending ? (
                  <Loader
                    title={t("Updating...")}
                    className="text-primary-foreground"
                  />
                ) : (
                  <>
                    {t("Save")}
                    <ArrowRight2 size={20} />
                  </>
                )}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </form>
    </Form>
  );
}
