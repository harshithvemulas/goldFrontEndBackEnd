"use client";

import { FileInput } from "@/components/common/form/FileInput";
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
import Switch from "@/components/ui/switch";
import { updateGateway } from "@/data/admin/updateGateway";
import { useSWR } from "@/hooks/useSWR";
import { imageURL, startCase } from "@/lib/utils";
import { ImageSchema } from "@/schema/file-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const createDynamicSchema = (fields: any[]) => {
  const dynamicFields: Record<string, any> = {};

  fields?.forEach((field) => {
    dynamicFields[field.key] = field.required
      ? z.string().min(1, { message: `${field.label} is required` })
      : z.string().optional();
  });

  return z.object({
    uploadLogo: ImageSchema,
    active: z.boolean().default(false),
    activeApi: z.boolean().default(false),
    recommended: z.boolean().default(false),
    allowedCurrencies: z.string(),
    ...dynamicFields,
  });
};

export function GatewayDetailsForm({ gateway, onMutate }: any) {
  const params = useParams();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const [isPending, startTransition] = useTransition();
  const { data, isLoading } = useSWR("/admin/gateways/config");
  const { t } = useTranslation();

  const formFields = data?.data?.[name as string];

  // Create form schema
  const formSchema = createDynamicSchema(formFields);
  type TFormData = z.infer<typeof formSchema>;

  // Form initial value
  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uploadLogo: gateway?.logoImage || "",
      active: !!gateway?.active,
      activeApi: !!gateway?.activeApi,
      recommended: !!gateway?.recommended,
      allowedCurrencies: gateway?.allowedCurrencies || "",
    },
  });

  useEffect(() => {
    if (!isLoading && formFields && gateway) {
      const dynamicDefaults: Record<string, any> = {};
      formFields.forEach((field: any) => {
        dynamicDefaults[field.key] = gateway[field.key] || "";
      });

      const defaultValues = {
        uploadLogo: gateway.uploadLogo,
        active: !!gateway.active,
        activeApi: !!gateway.activeApi,
        recommended: !!gateway.recommended,
        allowedCurrencies: gateway.allowedCurrencies
          ? JSON.parse(gateway.allowedCurrencies).join(", ")
          : "",
        ...dynamicDefaults,
      };

      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, formFields, gateway]);

  // update agent info data
  const onSubmit = (values: TFormData) => {
    const formData = {
      ...values,
      allowedCurrencies: JSON.stringify([values.allowedCurrencies]),
      name: gateway?.name,
      variables: gateway?.variables || JSON.stringify({}),
      value: gateway?.value,
      isCrypto: gateway?.isCrypto,
      allowedCountries: gateway?.allowedCountries,
    };

    startTransition(async () => {
      const res = await updateGateway(formData, params?.gatewayId as string);
      if (res.status) {
        onMutate();
        toast.success(res.message);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const renderFields = (f: any) => {
    switch (f?.type) {
      case "select":
        return (
          <FormField
            control={form.control}
            name={f?.key}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t(f?.label)}</FormLabel>
                <FormControl>
                  <RadioGroup
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="grid-cols-12 gap-4"
                  >
                    {f.options.map((option: any) => (
                      <Label
                        key={option.value}
                        htmlFor={option.value}
                        data-active={field.value === option.value}
                        className="col-span-12 flex h-12 cursor-pointer items-center justify-start rounded-xl border-[3px] border-border bg-input-disabled p-4 text-sm font-semibold leading-5 transition-all duration-300 ease-in-out hover:border-primary-selected hover:bg-primary-selected data-[active=true]:border-primary data-[active=true]:bg-primary-selected md:col-span-6"
                      >
                        <RadioGroupItem
                          id={option.value}
                          value={option.value}
                          className="absolute left-0 top-0 opacity-0"
                        />
                        <span>{t(option.label)}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      default:
        return (
          <FormField
            key={f?.key}
            name={f?.key}
            control={form.control}
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>{t(f?.label)}</FormLabel>
                <FormControl>
                  <Input
                    type={f?.type}
                    placeholder={t("Enter {{label}}", { label: f?.label })}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  return (
    <AccordionItem
      value="GatewayDetails"
      className="mb-4 rounded-xl border border-border bg-background px-4 py-0"
    >
      <AccordionTrigger className="py-6 hover:no-underline">
        <p className="text-base font-medium leading-[22px]">
          {startCase(gateway?.name)}
        </p>
      </AccordionTrigger>
      <AccordionContent className="gap-4 border-t pt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 px-1"
          >
            <FormField
              control={form.control}
              name="uploadLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Gateway logo")}</FormLabel>
                  <FormControl>
                    <FileInput
                      defaultValue={imageURL(gateway?.logoImage)}
                      id="uploadLogo"
                      onChange={(file) => field.onChange(file)}
                      className="flex aspect-square h-[160px] w-[160px] items-center justify-center border-dashed border-primary bg-transparent"
                    >
                      <div className="flex flex-col items-center gap-2.5">
                        <ImageIcon />
                        <p className="text-sm font-normal text-primary">
                          {t("Upload logo")}
                        </p>
                      </div>
                    </FileInput>
                  </FormControl>
                </FormItem>
              )}
            />

            {formFields?.map((f: any) => renderFields(f))}

            <FormField
              name="active"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-auto flex flex-row items-center gap-2">
                  <Label className="space-y-auto m-0 mb-0 mt-2 h-auto w-[130px] py-0 text-sm font-semibold">
                    {t("Active")}
                  </Label>
                  <FormControl>
                    <Switch
                      defaultChecked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="activeApi"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-auto flex flex-row items-center gap-2">
                  <Label className="space-y-auto m-0 mb-0 mt-2 h-auto w-[130px] py-0 text-sm font-semibold">
                    {t("Active API")}
                  </Label>
                  <FormControl>
                    <Switch
                      defaultChecked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="recommended"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-auto flex flex-row items-center gap-2">
                  <Label className="space-y-auto m-0 mb-0 mt-2 h-auto w-[130px] py-0 text-sm font-semibold">
                    {t("Recommended")}
                  </Label>
                  <FormControl>
                    <Switch
                      defaultChecked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="allowedCurrencies"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>{t("Supported Currencies")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="USD, EUR, GBP, AUD, CAD, SGD"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button className="rounded-lg">
                {isPending ? (
                  <Loader
                    title={t("Updating...")}
                    className="text-primary-foreground"
                  />
                ) : (
                  <>
                    {t("Update gateway")}
                    <ArrowRight2 size={20} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AccordionContent>
    </AccordionItem>
  );
}
