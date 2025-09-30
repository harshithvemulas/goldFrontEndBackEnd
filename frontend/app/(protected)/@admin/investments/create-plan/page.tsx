"use client";

import InvestmentDescription from "@/app/(protected)/@admin/investments/create-plan/_components/investment-description";
import InvestmentDetails from "@/app/(protected)/@admin/investments/create-plan/_components/investment-details";
import { Form } from "@/components/ui/form";
import { createInvestmentPlan } from "@/data/investments/createInvestmentPlan";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  description: z.string({ required_error: "Description is required" }),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isRange: z.string({ required_error: "Investment type is required" }),
  minAmount: z.string({ required_error: "Minimum amount is required" }),
  maxAmount: z.string({ required_error: "Maximum amount is required" }),
  currency: z.string({ required_error: "Currency is required" }),
  interestRate: z.string({ required_error: "Interest rate is required" }),
  duration: z.string({ required_error: "Duration is required" }),
  durationType: z.string({ required_error: "Duration type is required" }),
  withdrawAfterMatured: z.string({
    required_error: "Withdraw after matured is required",
  }),
});

export type InvestmentFormData = z.infer<typeof formSchema>;

export default function CreatePlan() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<InvestmentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      isFeatured: false,
      isRange: "1",
      minAmount: "0",
      maxAmount: "0",
      currency: "",
      interestRate: "",
      duration: "",
      durationType: "daily",
      withdrawAfterMatured: "1",
    },
  });

  const onSubmit = (values: InvestmentFormData) => {
    startTransition(async () => {
      const res = await createInvestmentPlan(values);

      if (res?.status) {
        toast.success("Investment plan created successfully");
        router.push("/investments/manage-plans");
      } else {
        toast.error(res?.message);
      }
    });
  };

  return (
    <div className="h-[calc(100vh-157px)] overflow-y-auto bg-background p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 && <InvestmentDetails form={form} setStep={setStep} />}

          {step === 2 && (
            <InvestmentDescription
              form={form}
              setStep={setStep}
              isPending={isPending}
            />
          )}
        </form>
      </Form>
    </div>
  );
}
