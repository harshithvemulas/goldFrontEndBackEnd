"use client";

import { Button } from "@/components/ui/button";
import { logoutOtherDevice } from "@/data/settings/logout-session";
import { Logout } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function ActionMenu({ row }: { row: any }) {
  const router = useRouter();
  const { t } = useTranslation();

  const logoutFromOtherDevice = () => {
    toast.promise(logoutOtherDevice(row.id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res?.status) throw new Error(res.message);
        router.refresh();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    <Button
      type="button"
      disabled={!row?.active}
      variant="destructive"
      size="icon"
      className="h-8 w-8"
      onClick={logoutFromOtherDevice}
    >
      <Logout size={17} />
    </Button>
  );
}
