"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { kycAcceptDecline } from "@/data/settings/kyc-settings";
import { useSWR } from "@/hooks/useSWR";
import { KYC } from "@/types/kyc";
import {
  CloseCircle,
  DocumentDownload,
  Eye,
  Shield,
  ShieldCross,
  ShieldSearch,
  ShieldTick,
  TickCircle,
} from "iconsax-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function KFCSettings() {
  const params = useParams(); // get customerId from params
  // fetch user by id
  const { data, mutate, isLoading } = useSWR(
    `/admin/customers/${params.customerId}`,
  );

  const { t } = useTranslation();

  // toggling kyc
  const handleKYC = (id: string | number, type: "accept" | "decline") => {
    toast.promise(kycAcceptDecline(id, type), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        mutate(data);
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  const kyc = data?.data?.user?.kyc ? new KYC(data.data.user.kyc) : null;

  return (
    <Accordion
      type="multiple"
      defaultValue={["KYC_STATUS", "DOCUMENT_INFORMATION"]}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-xl border border-border bg-background">
          <AccordionItem value="KYC_STATUS" className="border-none px-4 py-0">
            <AccordionTrigger className="py-6 hover:no-underline">
              <div className="flex items-center gap-1">
                <p className="text-base font-medium leading-[22px]">
                  {t("KYC Status")}
                </p>

                {/* If KYC data is not found, display 'Awaiting Status' */}
                <Case condition={!kyc}>
                  <Badge className="h-5 bg-foreground text-[10px] text-background">
                    {t("Awaiting submission")}
                  </Badge>
                </Case>

                {/* If KYC status is pending, display 'Pending Status' */}
                <Case condition={kyc?.status === "pending"}>
                  <Badge className="h-5 bg-primary text-[10px] text-primary-foreground">
                    {t("Pending")}
                  </Badge>
                </Case>

                <Case condition={kyc?.status === "verified"}>
                  <Badge className="h-5 bg-spacial-green text-[10px] text-spacial-green-foreground">
                    {t("Verified")}
                  </Badge>
                </Case>

                <Case condition={kyc?.status === "failed"}>
                  <Badge className="h-5 bg-danger text-[10px] text-destructive-foreground">
                    {t("Rejected")}
                  </Badge>
                </Case>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-6 border-t border-divider px-1 pt-4">
              {/* Awaiting alert type */}
              <Case condition={!kyc}>
                <Alert className="border-none bg-transparent shadow-default [&>svg]:text-foreground">
                  <Shield size="32" variant="Bulk" />
                  <AlertTitle className="ml-2.5 text-sm font-semibold leading-5">
                    {t("User have not submitted documents yet")}
                  </AlertTitle>
                  <AlertDescription className="ml-2.5 text-sm font-normal">
                    {t(
                      "To ensure maximum security, two-factor authentication is always on by default. You will have to verify your email each time you log in.",
                    )}
                  </AlertDescription>
                </Alert>
              </Case>

              <Case condition={kyc?.status === "pending"}>
                {/* Pending alert type */}
                <Alert className="border-none bg-transparent shadow-default [&>svg]:text-primary">
                  <ShieldSearch size="32" variant="Bulk" />
                  <AlertTitle className="ml-2.5 text-sm font-semibold leading-5">
                    {t("Pending verification")}
                  </AlertTitle>
                  <AlertDescription className="ml-2.5 text-sm font-normal">
                    {t(
                      "To ensure maximum security, two-factor authentication is always on by default. You will have to verify your email each time you log in.",
                    )}
                  </AlertDescription>
                </Alert>
              </Case>

              <Case condition={kyc?.status === "verified"}>
                <Alert className="border-none bg-transparent shadow-default [&>svg]:text-spacial-green">
                  <ShieldTick size="32" variant="Bulk" />
                  <AlertTitle className="ml-2.5 text-sm font-semibold leading-5">
                    {t("Your account is verified")}
                  </AlertTitle>
                  <AlertDescription className="ml-2.5 text-sm font-normal">
                    {t(
                      "To ensure maximum security, two-factor authentication is always on by default. You will have to verify your email each time you log in.",
                    )}
                  </AlertDescription>
                </Alert>
              </Case>

              <Case condition={kyc?.status === "failed"}>
                <Alert className="border-none bg-transparent shadow-default [&>svg]:text-danger">
                  <ShieldCross size="32" variant="Bulk" />
                  <AlertTitle className="ml-2.5 text-sm font-semibold leading-5">
                    {t("KYC Document Rejected")}
                  </AlertTitle>
                  <AlertDescription className="ml-2.5 text-sm font-normal">
                    {t(
                      "The submitted KYC document has been rejected. Please review the document for discrepancies or invalid details and request the user to submit accurate information for verification.",
                    )}
                  </AlertDescription>
                </Alert>
              </Case>
            </AccordionContent>
          </AccordionItem>
        </div>

        <div className="rounded-xl border border-border bg-background">
          <AccordionItem
            value="DOCUMENT_INFORMATION"
            className="border-none px-4 py-0"
          >
            <AccordionTrigger className="py-6 hover:no-underline">
              <div className="flex items-center gap-1">
                <p className="text-base font-medium leading-[22px]">
                  {t("Documents")}
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-6 border-t border-divider px-1 pt-4">
              {!kyc ? (
                <div className="py-4">
                  <p className="text-secondary-text">
                    {t("KYC Documents not submitted yet")}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="max-w-[900px]">
                    <Table className="table-fixed">
                      <TableHeader className="[&_tr]:border-b-0">
                        <TableRow>
                          <TableHead>{t("KYC")}</TableHead>
                          <TableHead>{t("Menu")}</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={2}>
                              <Loader />
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            <TableRow className="odd:bg-accent">
                              <TableCell>{t("Document type")}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 sm:gap-10">
                                  <span className="hidden font-semibold sm:block">
                                    {kyc?.documentType as string}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                            <KYCTableRow
                              title={t("Front image")}
                              preview={kyc?.front as string}
                            />

                            <KYCTableRow
                              title={t("Back image")}
                              preview={kyc?.back as string}
                            />

                            <KYCTableRow
                              title={t("Selfie")}
                              preview={kyc?.selfie as string}
                            />
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <Case condition={kyc.status?.toLowerCase() === "pending"}>
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
                      <Button
                        type="button"
                        onClick={() => handleKYC(kyc.id, "accept")}
                        className="bg-[#0B6A0B] text-white hover:bg-[#208c20]"
                      >
                        <TickCircle />
                        {t("Approve")}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleKYC(kyc.id, "decline")}
                        className="bg-[#D13438] text-white hover:bg-[#c32d32]"
                      >
                        <CloseCircle />
                        {t("Reject")}
                      </Button>
                    </div>
                  </Case>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </div>
      </div>
    </Accordion>
  );
}

function KYCTableRow({ title, preview }: { title: string; preview: string }) {
  const { t } = useTranslation();

  return (
    <TableRow className="odd:bg-accent">
      <TableCell>{title}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1 sm:gap-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="bg-background hover:bg-muted"
              >
                <Eye />
                <span className="hidden sm:block">{t("View")}</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-7xl">
              <DialogHeader>
                <DialogTitle> {title} </DialogTitle>
                <DialogDescription className="hidden" aria-hidden />
              </DialogHeader>

              <div className="relative mx-auto aspect-square w-full max-w-xl">
                {preview ? (
                  <Image
                    src={preview}
                    alt={title}
                    fill
                    sizes="500px"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    quality="90"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Vw8AAmEBb87E6jIAAAAASUVORK5CYII="
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-md bg-accent">
                    <span className="font-semibold opacity-70">
                      {t("No preview")}
                    </span>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            className="bg-background hover:bg-muted"
            asChild
          >
            <a href={preview} download>
              <DocumentDownload />
              <span className="hidden sm:inline-block">{t("Download")}</span>
            </a>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
