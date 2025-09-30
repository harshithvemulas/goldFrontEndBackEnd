"use client";

import LoginSessionTable from "@/components/common/LoginSessionTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Separator from "@/components/ui/separator";
import { logoutAllOtherDevice } from "@/data/settings/logout-session";
import { useTableData } from "@/hooks/useTableData";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function LoginSessions() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();

  const { data, meta, isLoading } = useTableData(
    `/login-sessions?page=${searchParams.get("page") ?? 1}&limit=${searchParams.get("limit") ?? 10}`,
  );

  // handle logout session
  const logoutFromAllDevice = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    toast.promise(logoutAllOtherDevice, {
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
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4 rounded-xl p-4 shadow-default">
        <CardHeader className="justify-center p-0 sm:h-10">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <CardTitle className="text-base font-medium leading-[22px]">
              {t("Login Sessions")}
            </CardTitle>
            <Button
              onClick={logoutFromAllDevice}
              variant="outline"
              size="sm"
              type="button"
              className="ml-2.5 cursor-pointer text-sm"
              asChild
            >
              <div>{t("Logout from all device")}</div>
            </Button>
          </div>
        </CardHeader>

        <Separator className="mb-1 mt-[5px]" />

        <CardContent className="p-0">
          <LoginSessionTable data={data} isLoading={isLoading} meta={meta} />
        </CardContent>
      </Card>
    </div>
  );
}
