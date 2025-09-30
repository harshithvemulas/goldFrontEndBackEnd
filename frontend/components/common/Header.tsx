"use client";

import NotificationButton from "@/components/common/notifications/NotificationButton";
import { logout } from "@/data/auth/logout";
import { useApp } from "@/hooks/useApp";
import { imageURL, startCase } from "@/lib/utils";
import {
  ArrowDown2,
  HambergerMenu,
  Logout,
  MessageQuestion,
  Setting2,
} from "iconsax-react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { toast } from "sonner";

import { LangSwitcher } from "@/components/common/LangSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function Header({
  accountSettingLink = "/settings",
}: {
  accountSettingLink?: string;
}) {
  const { t } = useTranslation();
  const segment = useSelectedLayoutSegment();
  const pageTitle = startCase(
    segment ? segment.replace(/[()]/g, "") : t("Dashboard"),
  );
  const router = useRouter();
  const { auth, refreshAuth, isLoading: authLoading } = useAuth();
  const { setIsExpanded } = useApp();

  // handle logout
  const handleLogout = () => {
    toast.promise(logout, {
      loading: t("Loading..."),
      success: () => {
        window.location.href = "/signin";
        refreshAuth();
        return t("Successfully logout.");
      },
      error: () => {
        return t("Something went wrong. Please try again.");
      },
    });
  };

  if (authLoading) return <div className="h-20 bg-background" />;

  return (
    <div className="inline-container flex min-h-[76px] w-full items-center justify-between gap-2 border-b border-black/10 bg-white px-4">
      <div className="flex items-center sm:gap-4 md:gap-10">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsExpanded((p) => !p)}
        >
          <HambergerMenu size={24} />
        </Button>
        <p className="hidden text-lg font-medium text-foreground sm:block">
          {t(pageTitle)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification */}
        <NotificationButton />

        {/* language */}
        <LangSwitcher
          triggerClassName="flex min-w-fit w-fit items-center gap-2 rounded-2xl bg-secondary px-4 py-2 transition duration-300 ease-in-out hover:bg-secondary-500"
          arrowClassName="size-4"
        />

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2 transition duration-300 ease-in-out hover:bg-secondary-500">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage src={imageURL(auth?.customer?.avatar)} />
              <AvatarFallback>
                {getAvatarFallback(auth?.customer?.name as string)}
              </AvatarFallback>
            </Avatar>

            <div className="hidden items-center gap-1 md:flex">
              <span className="hidden font-medium md:block">
                {auth?.customer?.name}
              </span>
              <ArrowDown2 size="16" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="mx-auto py-0" align="end">
            {auth?.roleId !== 5 && (
              <>
                {/* Account setting */}
                <DropdownMenuItem
                  onSelect={() => router.push(accountSettingLink)}
                  className="flex items-center gap-2"
                >
                  <Setting2 size="20" />
                  {t("Account settings")}
                </DropdownMenuItem>

                {/* Support */}
                <DropdownMenuItem
                  onSelect={() => router.push("/contact-supports")}
                  className="flex items-center gap-2"
                >
                  <MessageQuestion size="20" />
                  {t("Support")}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-divider-secondary" />
              </>
            )}

            {/* Logout  */}
            <DropdownMenuItem
              onSelect={() => handleLogout()}
              className="flex items-center gap-2"
            >
              <Logout size="20" />
              {t("Log out")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
