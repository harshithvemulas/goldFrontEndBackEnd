"use client";

import StaffForm from "@/app/(protected)/@admin/staffs/_components/staff-form";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { editAdmin } from "@/data/admin/staffs/editAdmin";
import { useCountries } from "@/data/useCountries";
import { useSWR } from "@/hooks/useSWR";
import { adminEditFormSchema } from "@/schema/admin-edit-schema";
import { Country } from "@/types/country";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowLeft } from "iconsax-react";
import { useParams, useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

export type AdminEditFormData = z.infer<typeof adminEditFormSchema>;

export default function EditStaff() {
  const { t } = useTranslation();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [country, setCountry] = React.useState<Country | null>();
  const { getCountryByCode } = useCountries();

  const { data, isLoading } = useSWR(`/admin/users/${params.staffId}`);

  const staff = data?.data?.customer;

  const form = useForm<AdminEditFormData>({
    resolver: zodResolver(adminEditFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      newPassword: "",
      addressLine: "",
      countryCode: staff?.address?.countryCode,
      zipCode: "",
      city: "",
      phone: "",
      gender: "male",
      dob: undefined,
    },
  });

  const init = React.useCallback(() => {
    if (data?.data?.id) {
      getCountryByCode(staff?.address?.countryCode, setCountry);
      form.reset({
        firstName: staff?.firstName,
        lastName: staff?.lastName,
        email: data?.data?.email,
        addressLine: staff?.address?.addressLine,
        countryCode: staff?.address?.countryCode,
        zipCode: staff?.address?.zipCode,
        city: staff?.address?.city,
        phone: staff?.phone,
        gender: staff?.customer?.gender,
        dob: new Date(staff?.dob),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  React.useEffect(() => init(), [init]);

  // handle form submission
  const onSubmit = (values: AdminEditFormData) => {
    startTransition(async () => {
      const { newPassword, ...restValues } = values;
      const submitData = newPassword
        ? {
            ...restValues,
            password: newPassword,
            dob: format(values.dob, "yyyy-MM-dd"),
          }
        : {
            ...restValues,
            dob: format(values.dob, "yyyy-MM-dd"),
          };

      const res = await editAdmin(submitData, params.staffId as string);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

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
          <h3>{t("Edit Staff")}</h3>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="flex flex-col space-y-4"
          >
            <StaffForm
              form={form}
              defaultCountry={country}
              defaultPhone={staff?.phone}
            />

            <div className="flex items-center justify-end py-4">
              <Button disabled={isPending}>
                {isPending ? (
                  <Loader
                    title={t("Processing...")}
                    className="text-primary-foreground"
                  />
                ) : (
                  t("Update")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
