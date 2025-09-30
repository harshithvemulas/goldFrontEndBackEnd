"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { acceptExchangeMoney } from "@/data/exchanges/admin/acceptExchange";
import { declineExchangeMoney } from "@/data/exchanges/admin/declineExchange";
import { CellContext } from "@tanstack/react-table";
import { CloseCircle, Eye, More, TickCircle } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface H extends Record<string, any> {
  id: number;
}

export default function MenuButton<T extends H>({
  row,
  ...props
}: CellContext<T, unknown>) {
  const { t } = useTranslation();
  const router = useRouter();

  const onApprove = () => {
    toast.promise(acceptExchangeMoney(row.original.id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        props.table.getState().onRefresh?.();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  const onReject = () => {
    toast.promise(declineExchangeMoney(row.original.id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        props.table.getState().onRefresh?.();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="hover:bg-muted"
        onClick={() => router.push(`/exchanges/${row.original.id}`)}
      >
        <Eye />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-md bg-background text-primary hover:bg-background"
          >
            <More size="20" className="text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="flex flex-col gap-1.5 rounded-sm p-1"
          align="end"
        >
          <DropdownMenuItem
            onSelect={() => onApprove()}
            className="my-0 flex h-full items-center gap-1 px-4 py-2 text-base font-medium leading-[22px] data-[highlighted]:bg-success data-[highlighted]:text-success-foreground"
          >
            <TickCircle />
            {t("Approve request")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => onReject()}
            className="my-0 flex h-full items-center gap-1 px-4 py-2 text-base font-medium leading-[22px] data-[highlighted]:bg-danger data-[highlighted]:text-danger-foreground"
          >
            <CloseCircle />
            {t("Reject request")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
