"use client";

import { Case } from "@/components/common/Case";
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
import { updateAgent } from "@/data/settings/updateAgent";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { mutate } from "swr";
import { z } from "zod";

// Agent info schema
const AgentInfoSchema = z.object({
  occupation: z.string({ required_error: "Occupation is required." }),
  whatsapp: z.string({ required_error: "Whatsapp is required." }),
  agentId: z.string({ required_error: "Agent ID is required." }),
});

type TAgentInfo = z.infer<typeof AgentInfoSchema>;

/*
 * Agent Information settings form component
 */
export function AgentInfoSettings({
  agent,
  isLoading,
}: {
  agent: any;
  isLoading: boolean;
}) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const form = useForm<TAgentInfo>({
    resolver: zodResolver(AgentInfoSchema),
    defaultValues: {
      occupation: "",
      whatsapp: "",
      agentId: "",
    },
  });

  React.useEffect(() => {
    if (agent) {
      form.reset({
        occupation: agent.occupation,
        whatsapp: agent.whatsapp || "",
        agentId: agent.agentId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent]);

  const onSubmit = (values: TAgentInfo) => {
    startTransition(async () => {
      const res = await updateAgent(values);
      if (res && res.status) {
        mutate("/agents/detail");
        toast.success(res.message);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  if (!agent && isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

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
                      className="text-base font-normal disabled:cursor-auto disabled:bg-accent disabled:opacity-100"
                      {...field}
                    />
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
