"use client";

import DataTable from "@/components/common/DataTable";
import { SearchBox } from "@/components/common/form/SearchBox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import Switch from "@/components/ui/switch";
import { deleteCard } from "@/data/cards/deleteCard";
import { updateCardStatus } from "@/data/cards/updateCardStatus";
import { useTableData } from "@/hooks/useTableData";
import { searchQuery } from "@/lib/utils";
import { Card } from "@/types/card";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { type SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, EyeSlash, Trash } from "iconsax-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function CardsPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [isVisibleNumber, setIsVisibleNumber] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const router = useRouter();
  const pathname = usePathname();

  const { data, meta, isLoading, refresh } = useTableData(
    `/admin/cards?${searchParams.toString()}`,
  );

  // handle search query
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const q = searchQuery(e.target.value);
    setSearch(e.target.value);
    router.replace(`${pathname}?${q.toString()}`);
  };

  const handleCardStatus = ({
    cardId,
    status,
  }: {
    cardId: string;
    status: string;
  }) => {
    toast.promise(
      updateCardStatus({
        cardId,
        dataList: { status },
        isAdmin: true,
      }),
      {
        loading: t("Loading..."),
        success: (res) => {
          if (!res.status) throw new Error(res.message);
          refresh();
          return res.message;
        },
        error: (err) => err.message,
      },
    );
  };

  return (
    <div className="p-4">
      <div className="w-full rounded-xl bg-background p-4 shadow-default md:p-6">
        {/* filter bar */}
        <div className="flex h-12 items-center">
          <div className="flex items-center gap-4">
            {/* Search box */}
            <SearchBox
              value={search}
              onChange={handleSearch}
              iconPlacement="end"
              placeholder={t("Search...")}
            />
          </div>
        </div>

        <Separator className="my-4" />
        {/* Data table */}
        <DataTable
          data={data ? data.map((d: any) => new Card(d)) : []}
          sorting={sorting}
          setSorting={setSorting}
          isLoading={isLoading}
          pagination={{
            total: meta?.total,
            page: meta?.currentPage,
            limit: meta?.perPage,
          }}
          structure={[
            {
              id: "id",
              header: t("Card ID"),
              cell: ({ row }) => (
                <p className="font-normal">#{row.original?.id}</p>
              ),
            },
            {
              id: "brand",
              header: t("Type"),
              cell: ({ row }) => (
                <p className="font-normal">{row.original?.brand}</p>
              ),
            },
            {
              id: "number",
              header: t("Number"),
              meta: { className: "w-[22%]" },
              cell: ({ row }) => (
                <div className="flex items-center gap-2">
                  <p className="font-normal">
                    {isVisibleNumber
                      ? row.original?.number.replace(/(\d{4})(?=\d)/g, "$1 ")
                      : `**** **** **** ${row.original?.lastFour}`}
                  </p>
                  <Button
                    aria-label="VisibilityToggler"
                    variant="secondary"
                    size="icon"
                    type="button"
                    className="rounded-md"
                    onClick={() => setIsVisibleNumber((t) => !t)}
                  >
                    {isVisibleNumber ? (
                      <Eye size={16} />
                    ) : (
                      <EyeSlash size={16} />
                    )}
                  </Button>
                </div>
              ),
            },
            {
              id: "cvc",
              header: t("CVV"),
              cell: ({ row }) => (
                <p className="font-normal">{row.original?.cvc}</p>
              ),
            },
            {
              id: "expYear",
              header: t("Exp. Date"),
              cell: ({ row }) => (
                <p className="font-normal">
                  {row.original?.expMonth.toString().padStart(2, "0")}/
                  {row.original?.expYear.toString().length === 4
                    ? row.original?.expYear.toString().slice(2)
                    : row.original?.expYear.toString()}
                </p>
              ),
            },
            {
              id: "status",
              header: t("Status"),
              cell: ({ row }) => (
                <Switch
                  defaultChecked={row.original?.status === "active"}
                  onCheckedChange={(checked) => {
                    handleCardStatus({
                      cardId: row.original?.id,
                      status: checked ? "active" : "inactive",
                    });
                  }}
                />
              ),
            },
            {
              id: "user",
              header: t("User"),
              cell: ({ row }) => (
                <Link
                  href={`/customers/${row.original.user.customer?.id}?name=${row.original.user?.customer?.name}&active=${row?.original?.user?.status}`}
                  className="flex min-w-[80px] items-center gap-2 font-normal text-secondary-text hover:text-foreground"
                >
                  <Avatar>
                    <AvatarImage
                      src={row.original.user.customer.profileImage}
                    />
                    <AvatarFallback>
                      {getAvatarFallback(row.original.user.customer.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="text-sm font-normal">
                      {row.original.user.customer.name}
                    </p>
                    {row.original?.user.email ? (
                      <p className="text-xs font-normal">
                        {row.original?.user.email}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ),
            },
            {
              id: "createdAt",
              header: t("Issue date"),
              cell: ({ row }) => (
                <div>
                  <p className="font-normal">
                    {format(row.original?.createdAt, "dd MMM yyyy;")}
                  </p>
                  <p className="font-normal">
                    {format(row.original?.createdAt, "hh:mm a")}
                  </p>
                </div>
              ),
            },
            {
              id: "actions",
              header: t("Actions"),
              cell: ({ row }) => (
                <div className="flex items-center gap-2">
                  <DeleteCardButton
                    cardId={row.original?.id}
                    onMutate={refresh}
                  />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

function DeleteCardButton({
  cardId,
  onMutate,
}: {
  cardId: number | string;
  onMutate: () => void;
}) {
  const { t } = useTranslation();

  const handleDeleteInvestment = async () => {
    const res = await deleteCard({ cardId, isAdmin: true });

    if (res.status) {
      onMutate();
      toast.success(t("Investment deleted successfully"));
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          color="danger"
          className="h-8 w-8 rounded-md bg-background text-danger hover:bg-background"
        >
          <Trash size={20} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Close Card")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("Are you sure you want to close this card?")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel>{t("No")}</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            onClick={handleDeleteInvestment}
            className="action:bg-destructive/80 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("Yes")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
