"use client";

import StaffForm from "@/app/(protected)/@admin/staffs/_components/staff-form";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createAdmin } from "@/data/admin/staffs/createAdmin";
import { adminCreateFormSchema } from "@/schema/admin-create-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowLeft } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

export type AdminCreateFormData = z.infer<typeof adminCreateFormSchema>;

export default function CreateStaff() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<AdminCreateFormData>({
    resolver: zodResolver(adminCreateFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      addressLine: "",
      zipCode: "",
      city: "",
      phone: "",
      gender: "male",
      dob: undefined,
    },
  });

  // handle form submission
  const onSubmit = (values: AdminCreateFormData) => {
    const submitValues = {
      ...values,
      dob: format(values.dob, "yyyy-MM-dd"),
    };
    startTransition(async () => {
      const res = await createAdmin(submitValues);
      if (res?.status) {
        toast.success(res.message);
        router.push("/staffs");
        form.reset();
      } else {
        toast.error(t(res.message));
      }
    });
  };

  // handle form error
  const onError = () => {
    toast.error(t("Something went wrong."));
  };

  return (
    <div className="min-h-[calc(100vh-78px)] bg-background">
      <div className="container max-w-[716px] py-16">
        <div className="mb-8 flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft />
          </Button>
          <h3>{t("Create New Staff")}</h3>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="flex flex-col space-y-4"
          >
            <StaffForm form={form} />

            <div className="flex items-center justify-end py-4">
              <Button disabled={isPending}>
                {isPending ? (
                  <Loader
                    title={t("Processing...")}
                    className="text-primary-foreground"
                  />
                ) : (
                  t("Create")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
