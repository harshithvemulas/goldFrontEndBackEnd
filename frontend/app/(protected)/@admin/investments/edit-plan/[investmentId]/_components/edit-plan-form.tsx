import InvestmentDescription from "@/app/(protected)/@admin/investments/create-plan/_components/investment-description";
import InvestmentDetails from "@/app/(protected)/@admin/investments/create-plan/_components/investment-details";
import { Form } from "@/components/ui/form";
import { updateInvestmentPlan } from "@/data/investments/updateInvestmentPlan";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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

export default function EditPlanForm({
  formData,
}: {
  formData: InvestmentFormData;
}) {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();
  const params = useParams();

  const form = useForm<InvestmentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: false,
      isFeatured: false,
      isRange: "",
      minAmount: "0",
      maxAmount: "0",
      currency: formData.currency,
      interestRate: "",
      duration: "",
      durationType: formData.durationType,
      withdrawAfterMatured: "",
    },
  });

  useEffect(() => {
    if (formData) {
      form.reset({
        ...formData,
        minAmount: String(formData.minAmount),
        maxAmount: String(formData.maxAmount),
        interestRate: String(formData.interestRate),
        duration: String(formData.duration),
        isActive: !!formData.isActive,
        isFeatured: !!formData.isFeatured,
        isRange: formData.isRange ? "1" : "0",
        withdrawAfterMatured: formData.withdrawAfterMatured ? "1" : "0",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const onSubmit = (values: InvestmentFormData) => {
    startTransition(async () => {
      const res = await updateInvestmentPlan({
        formData: values,
        investmentId: String(params.investmentId),
      });

      if (res?.status) {
        toast.success(t("Investment plan updated successfully"));
        router.push("/investments/manage-plans");
      } else {
        toast.error(t(res?.message));
      }
    });
  };

  return (
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
  );
}
