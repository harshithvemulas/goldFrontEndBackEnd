"use client";

import { Case } from "@/components/common/Case";
import { SearchBox } from "@/components/common/form/SearchBox";
import { KycWalletCard } from "@/components/common/KycWalletCard";
import { Loader } from "@/components/common/Loader";
import { WalletCardDashboard } from "@/components/common/WalletCardDashboard";
import { FavoritesCard } from "@/components/page-components/dashboard/favorites-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Separator from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toggleQuickSendContact } from "@/data/customers/contacts/toggleQuickSend";
import { useContactList } from "@/data/useContactList";
import { useAuth } from "@/hooks/useAuth";
import { useBranding } from "@/hooks/useBranding";
import { useSWR } from "@/hooks/useSWR";
import { useWallets } from "@/hooks/useWallets";
import { copyContent, imageURL } from "@/lib/utils";
import { IWallet } from "@/types/wallet";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import {
  Add,
  ArrowLeft2,
  ArrowRight2,
  DocumentCopy,
  DocumentDownload,
  Edit2,
  ShoppingBag,
} from "iconsax-react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import QRCodeTemplate from "../payment-requests/create/_components/QRCodeTemplate";
import { PaymentReportChart } from "./_components/payment-report-chart";
import { QuickSendItem } from "./_components/quick-send-item";

export default function DashboardLayout({
  tableSlot,
}: {
  tableSlot: React.ReactNode;
}) {
  const [quickSearch, setQuickSearch] = React.useState("");
  const { wallets, isLoading: walletIsFetching } = useWallets();
  const {
    contacts,
    isLoading: contactsLoading,
    mutate,
  } = useContactList(`/contacts?search=${quickSearch}`);
  const { auth, isLoading: authLoading } = useAuth();
  const { siteUrl, defaultCurrency } = useBranding();
  const [chartCurrency, setChartCurrency] = React.useState(defaultCurrency);
  const { t } = useTranslation();

  // Fetch the monthly transaction report data based on the selected currency
  const { data: chartData, isLoading: isChartDataLoading } = useSWR(
    `/transactions/chart/moonthly-report?currency=${chartCurrency}`,
  );

  // Fetch total count of pending withdrawal and deposit requests
  const { data, isLoading: isCounting } = useSWR(
    `/transactions/counts/total?data=${format(new Date(), "yyyy-MM-dd")}`,
  );

  const { data: referral } = useSWR("/customers/referred-users");

  const quickContact = (contacts?: Record<string, any>[]) => {
    return Array.isArray(contacts) ? contacts.filter((c) => !!c.quickSend) : [];
  };

  // toggle quick sent
  const handleTogglingQuickContent = (
    contactId: string | number,
    type: "add" | "remove",
  ) => {
    if (quickContact(contacts)?.length > 3 && type === "add") {
      toast.error("You already added 4 contact into quick send");
    } else {
      toast.promise(toggleQuickSendContact(contactId, type), {
        loading: t("Loading..."),
        success: (res) => {
          if (!res?.status) throw new Error(res.message);
          mutate();
          return res.message;
        },
        error: (err) => err.message,
      });
    }
  };

  const getCanvas = () => {
    const qr = document.getElementById("merchant-qr-code");
    if (!qr) return;

    // eslint-disable-next-line consistent-return
    return html2canvas(qr, {
      onclone: (snapshot) => {
        const qrElement = snapshot.getElementById("merchant-qr-code");
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

  // Create a number formatter that
  // ensures numbers have at least 2 digits (e.g., 01, 02, 10)
  // Locale set to "en-US"
  const numberFormat = new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
  });

  return (
    <main className="p-4">
      <div className="mb-4 flex flex-wrap items-end gap-y-4 md:gap-4">
        <Case condition={authLoading}>
          <Skeleton className="h-[200px] w-[350px]" />
        </Case>

        <KycWalletCard
          isVerified={!!auth?.getKYCStatus()}
          documentStatus={auth?.kyc ? "submitted" : "not submitted"}
        />
        {walletIsFetching ? (
          <Skeleton className="h-[200px] w-[350px]" />
        ) : (
          wallets?.map(
            (wallet: IWallet) =>
              wallet.pinDashboard && (
                <WalletCardDashboard
                  key={wallet.id}
                  {...{
                    title: wallet?.currency.code,
                    balance: wallet.balance,
                    currency: wallet?.currency.code,
                    walletId: wallet.id,
                    card: wallet?.cards?.[0],
                  }}
                />
              ),
          )
        )}

        <Link
          href="/wallets"
          prefetch={false}
          className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-secondary-700 transition duration-300 ease-out hover:text-secondary-800"
        >
          <span>{t("Show all wallets")}</span>
          <ArrowRight2 size={12} />
        </Link>
      </div>

      <div className="flex flex-col gap-0 gap-y-4 md:gap-x-4 xl:flex-row">
        {/* Table section */}
        <div className="flex flex-1 flex-col gap-4">
          <Card className="flex flex-col gap-4 px-6 pb-4 pt-6 shadow-default">
            <CardHeader className="flex-row items-center justify-between gap-4 p-0">
              <div className="flex flex-col gap-2">
                <CardDescription className="text-xs font-normal leading-4 text-foreground">
                  {t("Total merchant payments received")} /{" "}
                  {format(new Date(), "MMMM")}
                </CardDescription>
                <div className="flex h-10 items-center">
                  <CardTitle className="text-xl font-semibold leading-10">
                    {/*
                     * Get and format the current month's total from chart data.
                     * Fallback to 0 if no matching data is found, then format it to 2 decimal places.
                     */}

                    {(
                      chartData?.data?.data?.find(
                        ({ month }: { month: number }) =>
                          numberFormat.format(month)?.toString() ===
                          format(new Date(), "MM"),
                      )?.total ?? 0
                    )?.toFixed(2)}

                    {/* Show currency */}
                    {` ${chartCurrency}`}
                  </CardTitle>
                </div>
              </div>
              <Select value={chartCurrency} onValueChange={setChartCurrency}>
                <SelectTrigger className="data-[placeholder]:text-placeholder h-8 w-[100px] bg-accent text-sm font-normal leading-5 [&>svg]:size-4">
                  <SelectValue placeholder={defaultCurrency} />
                </SelectTrigger>
                <SelectContent>
                  {wallets?.map((wallet: IWallet) => (
                    <SelectItem key={wallet.id} value={wallet?.currency.code}>
                      {wallet?.currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <Separator className="mb-1 mt-[5px]" />
            <CardContent className="p-0">
              {/* Dashboard Payment Received Report Chart */}
              <PaymentReportChart
                data={chartData?.data?.data ?? []}
                currencyCode={chartCurrency}
                isLoading={isChartDataLoading}
              />
            </CardContent>
          </Card>
          <React.Suspense>{tableSlot}</React.Suspense>
        </div>

        {/* Right section */}
        <div className="flex w-full flex-wrap gap-4 md:flex-row xl:max-w-[350px] xl:flex-col">
          {/* Received Card */}
          <div className="flex flex-1 items-center rounded-xl bg-background p-6 shadow-default md:flex-initial">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-4">
                <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-spacial-green-foreground text-spacial-green">
                  <ShoppingBag size="32" />
                </div>
                <div>
                  <h6 className="mb-1 font-semibold text-spacial-green">
                    {t("Received")}
                  </h6>
                  <p className="text-xs font-normal leading-4">
                    {t("Total payments today")}
                  </p>
                </div>
              </div>
              <div className="text-5xl font-semibold leading-[32px]">
                {numberFormat.format(isCounting ? 0 : data?.data?.payment)}
              </div>
            </div>
          </div>
          {/* Received Card End */}

          {/* Quick send */}
          <Drawer direction="right">
            <div className="flex-1 rounded-xl bg-background p-6 shadow-default xl:flex-initial">
              {/* Quick send card edit button */}
              <div className="mb-6 flex items-center justify-between">
                <p className="font-semibold text-foreground">
                  {t("Quick Send")}
                </p>
                <DrawerTrigger>
                  <Edit2 size={20} />
                </DrawerTrigger>
              </div>

              <div className="flex gap-[15px]">
                {contactsLoading &&
                  [...Array(4)].map((_, index) => (
                    <Skeleton
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className="size-10 rounded-full sm:size-12"
                    />
                  ))}
                {contacts
                  ? quickContact(contacts)?.map(
                      (contact: Record<string, any>) => (
                        <Link
                          key={contact.id}
                          href={`/transfer?email=${contact?.contact?.email}`}
                        >
                          <Avatar className="size-10 sm:size-12">
                            <AvatarImage
                              src={imageURL(
                                contact.contact.customer.profileImage,
                              )}
                              alt={contact.contact.customer.name}
                            />
                            <AvatarFallback>
                              {getAvatarFallback(contact.contact.customer.name)}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                      ),
                    )
                  : null}

                <DrawerTrigger className="flex size-10 items-center justify-center rounded-full border-2 border-border p-0 sm:size-12">
                  <Add size={20} />
                </DrawerTrigger>
              </div>
            </div>

            <DrawerContent className="inset-x-auto inset-y-0 bottom-auto left-auto right-0 top-0 m-0 flex h-full w-[95%] flex-col rounded-t-none bg-white px-0 py-8 md:w-[400px]">
              <DrawerTitle className="flex items-center justify-between gap-4 px-6">
                <div className="flex items-center gap-2.5">
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    className="h-10 w-10 rounded-lg"
                    asChild
                  >
                    <DrawerClose>
                      <ArrowLeft2 />
                    </DrawerClose>
                  </Button>
                  <span className="inline-block text-base font-semibold leading-[22px]">
                    {t("Quick Send")}
                  </span>
                </div>
              </DrawerTitle>
              <DrawerDescription className="hidden" />

              <div className="flex h-full w-full flex-1 flex-col p-0">
                {/* Search */}
                <div className="flex flex-col px-6 py-4">
                  <SearchBox
                    iconPlacement="end"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    className="h-10 rounded-lg bg-accent"
                    placeholder={t("Search...")}
                  />
                </div>

                <ScrollArea className="flex-1 px-6 pb-8">
                  <div className="flex w-full flex-col items-stretch gap-4">
                    {contactsLoading && <Loader className="mx-2" />}
                    {contacts?.map((contact: any) =>
                      contact.quickSend ? (
                        <QuickSendItem
                          // eslint-disable-next-line react/no-array-index-key
                          key={contact.id}
                          id={contact.id}
                          name={contact.contact.customer.name}
                          email={contact.contact.email}
                          checked
                          onSelect={(id: string | number) =>
                            handleTogglingQuickContent(id, "remove")
                          }
                        />
                      ) : null,
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex w-full flex-col items-stretch gap-y-4">
                    <div className="flex flex-col gap-y-2.5">
                      <h5 className="text-base font-semibold leading-[22px] text-foreground">
                        {t("Contacts")}
                      </h5>
                      <p className="text-xs font-normal text-secondary-text">
                        {t(
                          "Select up to 5 contacts to add them in the Quick Send list.",
                        )}
                      </p>
                    </div>
                    {contactsLoading && <Loader className="mx-2" />}
                    {contacts?.map((contact: any) =>
                      !contact.quickSend ? (
                        <QuickSendItem
                          // eslint-disable-next-line react/no-array-index-key
                          key={contact.id}
                          id={contact.id}
                          name={contact.contact.customer.name}
                          email={contact.contact.email}
                          onSelect={(id: string | number) =>
                            handleTogglingQuickContent(id, "add")
                          }
                        />
                      ) : null,
                    )}
                  </div>
                </ScrollArea>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Saved items */}
          <FavoritesCard />

          {/* QR Code */}
          <div className="w-full rounded-xl bg-background p-6 shadow-default">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold text-foreground">
                {t("Your QR Code")}
              </p>
            </div>
            <p className="mb-6 text-sm text-secondary-text">
              {t("Customers can scan this QR code to make payments.")}
            </p>
            <div className="mx-auto mb-6 flex max-w-[200px] items-center justify-center">
              <QRCodeTemplate
                id="merchant-qr-code"
                name={auth?.merchant?.name ?? ""}
                email={auth?.merchant?.email ?? ""}
              >
                <QRCodeCanvas
                  value={`${siteUrl}/mpay/qrform?merchantId=${auth?.merchant?.id}`}
                  size={200}
                  id="merchant-qr-code"
                />
              </QRCodeTemplate>
            </div>
            <Button onClick={downloadQRCode} className="w-full">
              <DocumentDownload size="24" />
              <span>{t("Download")}</span>
            </Button>
          </div>

          {/* Referral Link */}
          <div className="w-full rounded-xl bg-background p-6 shadow-default">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-semibold text-foreground">
                {t("Refer a friend")}
              </p>
              <Badge variant="secondary" className="bg-muted">
                {referral?.data?.referralUsers?.length
                  ? referral.data.referralUsers.length
                  : "0"}
              </Badge>
            </div>
            <p className="mb-6 text-sm text-secondary-text">
              {t("Share this referral link to your friends and earn money.")}
            </p>
            <div className="mb-2 line-clamp-1 flex h-12 w-full items-center text-ellipsis whitespace-nowrap rounded-[8px] bg-input px-3">
              {auth?.getReferralLink()}
            </div>
            <Button
              className="w-full"
              onClick={() => copyContent(auth?.getReferralLink() ?? "")}
            >
              <DocumentCopy size="24" />
              <span>{t("Copy link")}</span>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
