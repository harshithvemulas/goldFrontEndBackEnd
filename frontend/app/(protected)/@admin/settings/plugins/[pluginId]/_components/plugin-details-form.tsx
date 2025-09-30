"use client";

import { Loader } from "@/components/common/Loader";
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
import { updatePlugin } from "@/data/admin/plugins/updatePlugins";
import { useSWR } from "@/hooks/useSWR";
import { startCase } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2, DocumentText1 } from "iconsax-react";
import Link from "next/link";
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
    active: z.boolean().default(false),
    ...dynamicFields,
  });
};

export function PluginDetailsForm({ plugin, onMutate }: any) {
  const params = useParams();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const [isPending, startTransition] = useTransition();
  const { data, isLoading } = useSWR("/admin/external-plugins/config");
  const { t } = useTranslation();

  const formDetails = data?.data?.[name as string];
  const formFields = data?.data?.[name as string].fields;

  // Create form schema
  const formSchema = createDynamicSchema(formFields);
  type TFormData = z.infer<typeof formSchema>;

  // Form initial value
  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      active: !!plugin?.active,
    },
  });

  useEffect(() => {
    if (!isLoading && formFields && plugin) {
      const dynamicDefaults: Record<string, any> = {};
      formFields.forEach((field: any) => {
        dynamicDefaults[field.key] = plugin[field.key] || "";
      });

      const defaultValues = {
        active: !!plugin.active,
        ...dynamicDefaults,
      };

      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, formFields, plugin]);

  // update agent info data
  const onSubmit = (values: TFormData) => {
    startTransition(async () => {
      const res = await updatePlugin(values, params?.pluginId as string);
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
    <div className="mb-4 rounded-xl border border-border bg-background px-4">
      <div className="flex justify-between py-6 hover:no-underline">
        <div className="flex flex-col items-start">
          <p className="mb-1 text-base font-medium leading-[22px]">
            {startCase(plugin?.name)}
          </p>
          <p className="text-sm text-secondary-text">
            {formDetails?.description}
          </p>
        </div>
        <Link
          href={formDetails?.documentation}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-secondary-text underline-offset-4 transition duration-300 ease-out hover:text-primary hover:underline"
        >
          <DocumentText1 size={20} variant="Bulk" />
          <span className="text-inherit">{t("Read Documentation")}</span>
        </Link>
      </div>
      <div className="gap-4 border-t py-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 px-1"
          >
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

            <div className="flex justify-end">
              <Button className="rounded-lg">
                {isPending ? (
                  <Loader
                    title={t("Updating...")}
                    className="text-primary-foreground"
                  />
                ) : (
                  <>
                    {t("Update plugin")}
                    <ArrowRight2 size={20} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
