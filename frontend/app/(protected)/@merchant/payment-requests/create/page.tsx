"use client";

import QRCodeTemplate from "@/app/(protected)/@merchant/payment-requests/create/_components/QRCodeTemplate";
import { Case } from "@/components/common/Case";
import { CountrySelection } from "@/components/common/form/CountrySelection";
import { SelectCurrency } from "@/components/common/form/SelectCurrency";
import { Loader } from "@/components/common/Loader";
import { PageLayout, RightSidebar } from "@/components/common/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { initQr } from "@/data/mpay/initQr";
import { makePaymentRequest } from "@/data/payments/makePaymentRequest";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import html2canvas from "html2canvas";
import { ArrowLeft2, ArrowRight2, DocumentDownload } from "iconsax-react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  // meter information
  name: z.string().min(1, "Name is required."),
  email: z.string().min(1, "Recipient's email is required."),
  amount: z.string().min(1, "Amount is required."),
  currency: z.string().min(1, "Currency is require."),
  address: z.string().min(1, "Address is require."),
  feeByCustomer: z.boolean().default(false),
  country: z.string().min(1, "Country is required"),
});

type TFormData = z.infer<typeof formSchema>;

type TQRCodeInfo = {
  url: string;
  name: string;
  email: string;
};

export default function ElectricityBillMeterDetails() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [qrCodeInfo, setQrCodeInfo] = useState<TQRCodeInfo>({
    url: "",
    name: "",
    email: "",
  });
  const { auth } = useAuth();

  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      currency: "",
      country: "",
      address: "",
      feeByCustomer: false,
    },
  });

  const onSubmit = (values: TFormData) => {
    startTransition(async () => {
      const res = await makePaymentRequest(values);
      const resQr = await initQr({
        customerName: values.name,
        customerEmail: values.email,
        amount: values.amount,
        currency: values.currency,
        feeByCustomer: values.feeByCustomer,
        merchantId: auth?.merchant?.id?.toString(),
      });
      if (res?.status) {
        toast.success(res.message);
        setOpen(true);
        setQrCodeInfo({
          url: resQr?.redirectUrl as string,
          name: res?.data?.from?.label,
          email: res?.data?.from?.email,
        });
        form.reset();
      } else {
        toast.success(res.message);
      }
    });
  };

  return (
    <PageLayout>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row overflow-y-auto"
        >
          <div className="w-full py-6 md:h-full">
            <div className="mx-auto max-w-3xl">
              <div className="my-8">
                <h2 className="mb-4 font-semibold">{t("Name")}</h2>
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="name"
                          placeholder={t("Enter recipient's name")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="my-8">
                <h2 className="mb-4 font-semibold">{t("Email")}</h2>
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("Enter recipient's email address")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="my-8">
                <h2 className="mb-4 font-semibold">{t("Address")}</h2>
                <FormField
                  name="address"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="address"
                          placeholder={t("Enter recipient's address")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="my-8">
                <h2 className="mb-4 font-semibold">{t("Country")}</h2>
                <FormField
                  name="country"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CountrySelection
                          onSelectChange={(country) =>
                            field.onChange(country?.code.cca2)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-8">
                <h2 className="mb-4 font-semibold">{t("Select Currency")}</h2>
                <FormField
                  name="currency"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectCurrency {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-8">
                <h2 className="mb-4 font-semibold">{t("Add Amount")}</h2>
                <FormField
                  name="amount"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={t("Enter request amount")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="feeByCustomer"
                render={({ field }) => (
                  <FormItem className="mb-8">
                    <FormControl>
                      <Label
                        htmlFor="feeByCustomer"
                        className="flex cursor-pointer items-center gap-2.5"
                      >
                        <Checkbox
                          id="feeByCustomer"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(Boolean(checked))
                          }
                        />
                        <span>{t("Fee by customer")}</span>
                      </Label>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="order-2 w-full sm:order-1 sm:w-fit"
                  asChild
                >
                  <Link href="/payment-requests">
                    <ArrowLeft2 size={16} />
                    <span>{t("Back")}</span>
                  </Link>
                </Button>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="order-1 flex w-[200px] gap-0.5 rounded-lg px-4 py-2 text-base font-medium leading-[22x] sm:order-2"
                >
                  <Case condition={!isPending}>
                    {t("Request payment")}
                    <ArrowRight2 size="16" />
                  </Case>
                  <Case condition={isPending}>
                    <Loader
                      title={t("Processing...")}
                      className="text-primary-foreground"
                    />
                  </Case>
                </Button>
              </div>
            </div>
          </div>
          {/* Right side section */}
          <RightSidebar>
            {/* Saved phone number */}
            <Card className="border-0 shadow-defaultLite">
              <CardHeader className="border-b p-6">
                <CardTitle className="text-base font-semibold leading-[22px]">
                  {t("Tip")}
                </CardTitle>
                <CardDescription className="text-xs font-normal text-secondary-text">
                  {t(
                    "When you request payment, the recipient will receive an automated email to pay you.",
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          </RightSidebar>
        </form>
      </Form>
      {qrCodeInfo.url && (
        <PaymentRequestQRCodeModal
          open={open}
          qrCodeInfo={qrCodeInfo}
          setOpen={setOpen}
          setQrCodeUrl={setQrCodeInfo}
        />
      )}
    </PageLayout>
  );
}

function PaymentRequestQRCodeModal({
  open,
  qrCodeInfo,
  setOpen,
  setQrCodeUrl,
}: {
  open: boolean;
  qrCodeInfo: TQRCodeInfo;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setQrCodeUrl: React.Dispatch<React.SetStateAction<TQRCodeInfo>>;
}) {
  const { t } = useTranslation();

  const getCanvas = () => {
    const qr = document.getElementById("payment-request-qr-code");
    if (!qr) return;

    // eslint-disable-next-line consistent-return
    return html2canvas(qr, {
      onclone: (snapshot) => {
        const qrElement = snapshot.getElementById("payment-request-qr-code");
        if (!qrElement) return;
        // Make element visible for cloning
        qrElement.style.display = "block";
      },
    });
  };

  const downloadQRCode = async () => {
    const canvas = await getCanvas();
    if (!canvas) throw new Error("<canvas> not found in DOM");

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "QR code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("Payment Request Sent")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className="mb-6">
            {t(
              "The recipient will get an email with a payment link. You can also download and share the QR code. This request is valid for 15 minutes.",
            )}
          </p>
          <div className="mx-auto mb-6 flex max-w-[200px] items-center justify-center">
            <QRCodeTemplate
              id="payment-request-qr-code"
              name={qrCodeInfo.name}
              email={qrCodeInfo.email}
            >
              <QRCodeCanvas
                value={qrCodeInfo.url}
                size={200}
                id="payment-request-qr-code"
                level="H"
              />
            </QRCodeTemplate>
          </div>
        </DialogDescription>
        <div className="flex items-center gap-2">
          <Button className="w-full" onClick={downloadQRCode}>
            <DocumentDownload size="24" />
            <span>{t("Download")}</span>
          </Button>
          <Button
            onClick={() => {
              setQrCodeUrl({
                name: "",
                url: "",
                email: "",
              });
              setOpen(false);
            }}
            className="w-full"
            variant="outline"
          >
            {t("Close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
