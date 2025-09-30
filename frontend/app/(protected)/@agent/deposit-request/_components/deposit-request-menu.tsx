"use client";

import { Case } from "@/components/common/Case";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { acceptDepositRequest } from "@/data/deposit/acceptDepositRequest";
import { rejectDepositRequest } from "@/data/deposit/rejectDepositRequest";
import { CloseCircle, More, TickCircle } from "iconsax-react";
import { Eye } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { mutate } from "swr";

export function DepositRequestMenu({ row }: { row: any }) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  // handle deposit request
  const handleAcceptDepositRequest = () => {
    toast.promise(acceptDepositRequest(row.id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        mutate("/deposit-requests?page=1&limit=10");
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  const handleRejectDepositRequest = () => {
    toast.promise(rejectDepositRequest(row.id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        mutate("/deposit-requests?page=1&limit=10");
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <More size="20" className="text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="flex flex-col gap-1.5 rounded-sm p-1"
        align="end"
      >
        <DropdownMenuItem
          onSelect={() => router.push(`${pathname}/${row.trxId}`)}
          className="my-0 flex h-full items-center gap-1 px-4 py-2 text-base font-medium leading-[22px] data-[highlighted]:bg-success data-[highlighted]:text-success-foreground"
        >
          <Eye />
          {t("Preview")}
        </DropdownMenuItem>

        <Case condition={row.status === "pending"}>
          <DropdownMenuItem
            onSelect={handleAcceptDepositRequest}
            className="my-0 flex h-full items-center gap-1 px-4 py-2 text-base font-medium leading-[22px] data-[highlighted]:bg-success data-[highlighted]:text-success-foreground"
          >
            <TickCircle />
            {t("Approve request")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={handleRejectDepositRequest}
            className="my-0 flex h-full items-center gap-1 px-4 py-2 text-base font-medium leading-[22px] data-[highlighted]:bg-danger data-[highlighted]:text-danger-foreground"
          >
            <CloseCircle />
            {t("Reject request")}
          </DropdownMenuItem>
        </Case>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
