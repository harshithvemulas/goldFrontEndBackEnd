"use client";

import { Case } from "@/components/common/Case";
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
import Label from "@/components/ui/label";
import Separator from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";

import { FileInput } from "@/components/common/form/FileInput";
import { Loader } from "@/components/common/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCustomerKycDocument } from "@/data/customers/settings/updateCustomerKycDocument";
import { imageURL } from "@/lib/utils";
import {
  KYCDocumentFormData,
  KYCDocumentFormSchema,
} from "@/schema/kyc-document-schema";
import { isAxiosError } from "axios";
import { ArrowRight2, DocumentUpload } from "iconsax-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { match } from "ts-pattern";

const DOCUMENT_TYPES = ["NID", "Passport", "Driving"];

export function DocumentInfo({
  fetchData,
  isLoading,
  refresh,
}: {
  fetchData: any;
  isLoading: boolean;
  refresh: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const { t } = useTranslation();

  const form = useForm<KYCDocumentFormData>({
    mode: "all",
    resolver: zodResolver(KYCDocumentFormSchema),
    defaultValues: {
      documentType: fetchData?.documentType ?? "",
      documentFrontSide: "",
      documentBackSide: "",
      selfie: "",
    },
  });

  useEffect(() => {
    if (fetchData?.documentType) {
      form.setValue("documentType", fetchData.documentType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  // kyc document submission handler function
  const onSubmit = (values: KYCDocumentFormData) => {
    startTransition(async () => {
      const res = await updateCustomerKycDocument(values);
      if (res && res.status) {
        refresh();
        toast.success(res.message);
      } else if (res.statusCode === 422) {
        if (isAxiosError(res.error) && res.error?.response?.data?.messages) {
          if (Array.isArray(res.error?.response?.data?.messages)) {
            const data = res.error?.response?.data?.messages;
            data?.forEach((el: any) => {
              match(el)
                .with({ field: "front" }, () =>
                  form.setError("documentFrontSide", {
                    message: t(el?.message),
                    type: "custom",
                  }),
                )
                .with({ field: "back" }, () =>
                  form.setError("documentBackSide", {
                    message: t(el?.message),
                    type: "custom",
                  }),
                )
                .with({ field: "selfie" }, () =>
                  form.setError("selfie", {
                    message: t(el?.message),
                    type: "custom",
                  }),
                )
                .otherwise(() => null);
            });

            toast.error(t("Please provide all required field."));
          }
        }
      } else {
        toast.error(t(res.message));
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        data-loading={isLoading}
        className="rounded-xl border border-border bg-background data-[loading=true]:pointer-events-none data-[loading=true]:opacity-50"
      >
        <AccordionItem
          value="DOCUMENT_INFORMATION"
          className="border-none px-4 py-0"
        >
          <AccordionTrigger className="py-6 hover:no-underline">
            <div className="flex items-center gap-10 text-base font-medium leading-[22px]">
              {t("Documents")}
              {isLoading && <Loader title={t("Loading...")} />}
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-6 border-t border-divider px-1 pt-4">
            {/* Document type */}
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Document Type")}</FormLabel>
                  <FormControl>
                    <Select
                      disabled={fetchData?.status === "verified"}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="data-[placeholder]:text-placeholder w-full max-w-[337px] bg-accent disabled:opacity-100 data-[placeholder]:text-base [&>svg>path]:stroke-primary [&>svg]:size-6 [&>svg]:opacity-100">
                        <SelectValue placeholder={t("Select document type")} />
                      </SelectTrigger>
                      <SelectContent align="start">
                        {DOCUMENT_TYPES.map((d) => (
                          <SelectItem key={d} value={d.toLowerCase()}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h5 className="mb-4 font-medium"> {t("Attach pictures")} </h5>

              <div className="flex w-full flex-wrap items-center gap-2.5 gap-y-4">
                {/* Front side  */}
                <FormField
                  control={form.control}
                  name="documentFrontSide"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-auto">
                      <FormLabel className="text-base font-medium text-secondary-text">
                        {t("Front Side")}
                      </FormLabel>
                      <FormControl>
                        <div className="flex w-full flex-col gap-2">
                          <FileInput
                            id="documentFrontSideFile"
                            disabled={fetchData?.status === "verified"}
                            defaultValue={imageURL(fetchData?.front)}
                            onChange={(file) => field.onChange(file)}
                            className="flex h-[270px] w-full items-center justify-center border-dashed border-primary bg-transparent sm:w-[400px]"
                          >
                            <div className="flex flex-col items-center gap-2.5">
                              <ImageIcon />
                              <p className="text-sm font-normal text-primary">
                                {t("Drag and drop file here or upload")}{" "}
                              </p>
                            </div>
                          </FileInput>
                          {fetchData?.status === "verified" ? null : (
                            <Button
                              asChild
                              type="button"
                              className="h-8 px-[12px] py-[5px] hover:cursor-pointer disabled:pointer-events-none"
                            >
                              <Label htmlFor="documentFrontSideFile">
                                <DocumentUpload size={20} />
                                <span className="text-sm font-semibold">
                                  {t("Upload")}
                                </span>
                              </Label>
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Case condition={form.watch("documentType") !== "passport"}>
                  <FormField
                    control={form.control}
                    name="documentBackSide"
                    render={({ field }) => (
                      <FormItem className="w-full md:w-auto">
                        <FormLabel className="text-base font-medium text-secondary-text">
                          {t("Back Side")}
                        </FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2">
                            <FileInput
                              id="documentBackSideFile"
                              disabled={fetchData?.status === "verified"}
                              defaultValue={imageURL(fetchData?.back)}
                              onChange={(file) => field.onChange(file)}
                              className="flex h-[270px] w-full items-center justify-center border-dashed border-primary bg-transparent sm:w-[400px]"
                            >
                              <div className="flex flex-col items-center gap-2.5">
                                <ImageIcon />
                                <p className="text-sm font-normal text-primary">
                                  {t("Drag and drop file here or upload")}{" "}
                                </p>
                              </div>
                            </FileInput>
                            {fetchData?.status === "verified" ? null : (
                              <Button
                                asChild
                                type="button"
                                className="h-8 px-[12px] py-[5px] hover:cursor-pointer"
                              >
                                <Label htmlFor="documentBackSideFile">
                                  <DocumentUpload size={20} />
                                  <span className="text-sm font-semibold">
                                    {t("Upload")}
                                  </span>
                                </Label>
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Case>
              </div>
            </div>

            <Separator className="border-b border-dashed bg-transparent" />

            {/* Selfie Section */}
            <div>
              <h5 className="mb-4 font-medium"> {t("Attach selfie")} </h5>

              <FormField
                control={form.control}
                name="selfie"
                render={({ field }) => (
                  <FormItem className="w-full md:w-auto">
                    <FormLabel className="text-base font-medium text-secondary-text">
                      {t("Selfie")}
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <FileInput
                          disabled={fetchData?.status === "verified"}
                          defaultValue={imageURL(fetchData?.selfie)}
                          id="selfieFile"
                          onChange={(file) => field.onChange(file)}
                          className="flex h-[270px] w-full items-center justify-center border-dashed border-primary bg-transparent sm:w-[400px]"
                        >
                          <div className="flex flex-col items-center gap-2.5">
                            <ImageIcon />
                            <p className="text-sm font-normal text-primary">
                              {t("Drag and drop file here or upload")}
                            </p>
                          </div>
                        </FileInput>
                        {fetchData?.status === "verified" ? null : (
                          <Button
                            asChild
                            type="button"
                            className="h-8 max-w-[400px] px-[12px] py-[5px] hover:cursor-pointer"
                          >
                            <Label htmlFor="selfieFile">
                              <DocumentUpload size={20} />
                              <span className="text-sm font-semibold">
                                {t("Upload")}
                              </span>
                            </Label>
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {
              /* Action section */
              fetchData?.status === "verified" ? null : (
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
              )
            }
          </AccordionContent>
        </AccordionItem>
      </form>
    </Form>
  );
}
