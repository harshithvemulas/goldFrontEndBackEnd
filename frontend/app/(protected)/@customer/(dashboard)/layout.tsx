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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import Separator from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toggleQuickSendContact } from "@/data/customers/contacts/toggleQuickSend";
import { useContactList } from "@/data/useContactList";
import { useAuth } from "@/hooks/useAuth";
import { useWallets } from "@/hooks/useWallets";
import axios from "@/lib/axios";
import { copyContent, imageURL } from "@/lib/utils";
import { IWallet } from "@/types/wallet";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import {
  Add,
  ArrowLeft2,
  ArrowRight2,
  DocumentCopy,
  Edit2,
} from "iconsax-react";
import Link from "next/link";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import useSWR from "swr";
import { QuickSendItem } from "./_components/quick-send-item";

export default function DashboardLayout({
  tableSlot,
}: {
  tableSlot: React.ReactNode;
}) {
  const [search, setSearch] = React.useState("");
  const { auth, isLoading: authLoading } = useAuth();
  const {
    wallets,
    isLoading: walletIsFetching,
    mutate: walletMutate,
  } = useWallets();
  const { t } = useTranslation();

  const {
    contacts,
    isLoading: contactsLoading,
    mutate,
  } = useContactList(`/contacts?search=${search}`);

  const { data: referral } = useSWR("/customers/referred-users", (url) =>
    axios.get(url),
  );

  const quickContact = (contacts?: Record<string, any>[]) => {
    return Array.isArray(contacts) ? contacts.filter((c) => !!c.quickSend) : [];
  };

  console.log(wallets);

  // toggle quick sent
  const handleTogglingQuickContent = (
    contactId: string | number,
    type: "add" | "remove",
  ) => {
    if (quickContact(contacts)?.length > 3 && type === "add") {
      toast.error(t("You already added 4 contact into quick send"));
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

  console.log(wallets);

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
                    onMutate: walletMutate,
                  }}
                />
              ),
          )
        )}

        <Link
          href="/wallets"
          prefetch={false}
          className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-secondary-700 transition duration-300 ease-out hover:text-primary hover:underline"
        >
          <span>{t("Show all wallets")}</span>
          <ArrowRight2 size={12} />
        </Link>
      </div>

      {/* Table */}
      <div className="flex flex-col gap-0 gap-y-4 md:gap-4 xl:flex-row">
        {/* Table section */}
        <div className="flex-1">
          <React.Suspense>{tableSlot}</React.Suspense>
        </div>

        <div className="flex w-full flex-wrap gap-4 md:flex-row xl:max-w-[350px] xl:flex-col">
          <Drawer direction="right">
            <div className="w-full rounded-xl bg-background p-6 shadow-default">
              <div className="mb-6 flex items-center justify-between">
                <p className="font-semibold text-foreground">
                  {t("Quick Send")}
                </p>
                <DrawerTrigger>
                  <Button type="button" size="sm" variant="ghost">
                    <Edit2 size={20} />
                  </Button>
                </DrawerTrigger>
              </div>

              <div className="flex items-center gap-[15px]">
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

                <DrawerTrigger className="flex size-10 items-center justify-center rounded-full border-2 border-btn-outline-border p-0 sm:size-12">
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
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    iconPlacement="end"
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
                          key={contact.id}
                          id={contact.id}
                          name={contact.contact.customer.name}
                          email={contact.contact.email}
                          checked
                          onSelect={(id) =>
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
                          key={contact.id}
                          id={contact.id}
                          name={contact.contact.customer.name}
                          email={contact.contact.email}
                          onSelect={(id) =>
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

          {/* Referral Link */}
          <div className="w-full rounded-xl bg-background p-6 shadow-default">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-semibold text-foreground">
                {t("Refer a friend")}
              </p>
              <Badge
                variant="secondary"
                className="flex h-6 w-6 items-center justify-center bg-muted"
              >
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
