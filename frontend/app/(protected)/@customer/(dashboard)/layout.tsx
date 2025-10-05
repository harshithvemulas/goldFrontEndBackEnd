"use client";

/* eslint-disable react/no-array-index-key */
import { Case } from "@/components/common/Case";
import { KycWalletCard } from "@/components/common/KycWalletCard";
import { WalletCardDashboard } from "@/components/common/WalletCardDashboard";
import { FavoritesCard } from "@/components/page-components/dashboard/favorites-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { toggleQuickSendContact } from "@/data/customers/contacts/toggleQuickSend";
import { useContactList } from "@/data/useContactList";
import { useAuth } from "@/hooks/useAuth";
import { useWallets } from "@/hooks/useWallets";
import axios from "@/lib/axios";
import { copyContent } from "@/lib/utils";
import { IWallet } from "@/types/wallet";
import { ArrowRight2, DocumentCopy, Edit2 } from "iconsax-react";
import Link from "next/link";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import useSWR from "swr";
import QuickSendAvatars from "./_components/quick-send-avatar";
import QuickSendDrawer from "./_components/quick-send-drawer";

export interface QuickContactType {
  id: string | number;
  quickSend: boolean;
  contact: {
    email: string;
    customer: {
      name: string;
      profileImage?: string;
    };
  };
}

export const quickContacts = (contacts?: QuickContactType[]) =>
  Array.isArray(contacts) ? contacts.filter((c) => c.quickSend) : [];

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
    axios.get(url).then((res) => res.data),
  );

  const handleToggleQuickContact = (
    id: string | number,
    type: "add" | "remove",
  ) => {
    if (quickContacts(contacts)?.length > 3 && type === "add") {
      toast.error(t("You already added 4 contact into quick send"));
      return;
    }
    toast.promise(toggleQuickSendContact(id, type), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res?.status) throw new Error(res.message);
        mutate();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    <main className="p-4">
      {/* Wallet cards */}
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
                  title={wallet.currency.code}
                  balance={wallet.balance}
                  currency={wallet.currency.code}
                  walletId={wallet.id}
                  card={wallet.cards?.[0]}
                  onMutate={walletMutate}
                />
              ),
          )
        )}
        <Link
          href="/wallets"
          prefetch={false}
          className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-secondary-700 hover:text-primary hover:underline"
        >
          <span>{t("Show all wallets")}</span>
          <ArrowRight2 size={12} />
        </Link>
      </div>

      {/* Table + Side */}
      <div className="flex flex-col gap-4 xl:flex-row">
        {/* Mobile QuickSend */}
        <Drawer direction="right">
          <div className="w-full rounded-xl bg-background p-6 shadow-default md:hidden">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-semibold">{t("Quick Send")}</p>
              <DrawerTrigger>
                <Button type="button" size="sm" variant="ghost">
                  <Edit2 size={20} />
                </Button>
              </DrawerTrigger>
            </div>
            <QuickSendAvatars
              contacts={contacts}
              contactsLoading={contactsLoading}
            />
          </div>
          <QuickSendDrawer
            search={search}
            setSearch={setSearch}
            contacts={contacts}
            contactsLoading={contactsLoading}
            onToggle={handleToggleQuickContact}
          />
        </Drawer>

        {/* Table */}
        <div className="flex-1">
          <React.Suspense>{tableSlot}</React.Suspense>
        </div>

        {/* Sidebar */}
        <div className="flex w-full flex-wrap gap-4 md:flex-row xl:max-w-[350px] xl:flex-col">
          {/* Desktop QuickSend */}
          <Drawer direction="right">
            <div className="hidden w-full rounded-xl bg-background p-6 shadow-default md:block">
              <div className="mb-6 flex items-center justify-between">
                <p className="font-semibold">{t("Quick Send")}</p>
                <DrawerTrigger>
                  <Button type="button" size="sm" variant="ghost">
                    <Edit2 size={20} />
                  </Button>
                </DrawerTrigger>
              </div>
              <QuickSendAvatars
                contacts={contacts}
                contactsLoading={contactsLoading}
              />
            </div>
            <QuickSendDrawer
              search={search}
              setSearch={setSearch}
              contacts={contacts}
              contactsLoading={contactsLoading}
              onToggle={handleToggleQuickContact}
            />
          </Drawer>

          <FavoritesCard />

          {/* Referral */}
          <div className="w-full rounded-xl bg-background p-6 shadow-default">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-semibold">{t("Refer a friend")}</p>
              <Badge variant="secondary">
                {referral?.data?.referralUsers?.length ?? 0}
              </Badge>
            </div>
            <p className="mb-6 text-sm text-secondary-text">
              {t("Share this referral link to your friends and earn money.")}
            </p>
            <div className="mb-2 line-clamp-1 flex h-12 items-center rounded-[8px] bg-input px-3">
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
