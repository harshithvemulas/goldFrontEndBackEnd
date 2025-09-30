"use client";

import { DeleteButton } from "@/app/(protected)/@agent/settings/methods/_components/delete-button";
import { MethodUpdateForm } from "@/app/(protected)/@agent/settings/methods/_components/method-update-form";
import DataTable from "@/components/common/DataTable";
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
import { useTableData } from "@/hooks/useTableData";
import { startCase } from "@/lib/utils";
import { SortingState } from "@tanstack/react-table";
import { Add } from "iconsax-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MethodCreationForm } from "./_components/method-creation-form";

export default function DepositAndWithdrawMethods() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { data, isLoading, meta, refresh } = useTableData("/agent-methods", {
    keepPreviousData: true,
  });

  return (
    <div className="rounded-xl border border-border bg-background">
      <div className="border-none px-4 py-0">
        <div className="py-6 hover:no-underline">
          <div className="flex w-full flex-wrap items-center gap-1">
            <p className="text-base font-medium leading-[22px]">
              {t("Available methods")}
            </p>

            <div className="flex-1" />

            <div onClick={(e) => e.stopPropagation()} role="presentation">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    className="mr-2.5 cursor-pointer text-sm"
                    asChild
                  >
                    <div>
                      <Add size={17} />
                      {t("Add New Method")}
                    </div>
                  </Button>
                </DialogTrigger>

                <DialogContent className="p-0">
                  <DialogHeader className="p-6">
                    <DialogTitle>{t("Create method")}</DialogTitle>
                    <DialogDescription className="hidden" />
                  </DialogHeader>
                  <MethodCreationForm
                    onMutate={() => refresh()}
                    close={() => setOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-divider px-1 py-4">
          <DataTable
            data={data}
            sorting={sorting}
            isLoading={isLoading}
            setSorting={setSorting}
            pagination={{
              total: meta?.total,
              page: meta?.currentPage,
              limit: meta?.perPage,
            }}
            structure={[
              {
                id: "name",
                header: t("Name"),
                cell: ({ row }) => (
                  <span className="block min-w-32">{row.original?.name}</span>
                ),
              },

              {
                id: "value",
                header: t("Value"),
                cell: ({ row }) => {
                  return (
                    row.original?.value || (
                      <span className="text-sm font-normal text-secondary-text">
                        N/A
                      </span>
                    )
                  );
                },
              },

              {
                id: "inputType",
                header: t("Input type"),
                cell: ({ row }) => (
                  <Badge variant="secondary">
                    {startCase(row.original?.inputType)}
                  </Badge>
                ),
              },

              {
                id: "otherName",
                header: t("Input name"),
                cell: ({ row }) => {
                  return (
                    row.original?.otherName || (
                      <span className="text-sm font-normal text-secondary-text">
                        N/A
                      </span>
                    )
                  );
                },
              },

              {
                id: "required",
                header: t("Required"),
                cell: ({ row }) => {
                  return (
                    <Badge variant="secondary">
                      {row.original?.requiredInput ? "Yes" : "No"}
                    </Badge>
                  );
                },
              },

              {
                id: "countryCode",
                header: t("Country code"),
                cell: ({ row }) => {
                  return (
                    <Badge variant="secondary">
                      {row.original?.countryCode}
                    </Badge>
                  );
                },
              },
              {
                id: "currencyCode",
                header: t("Currency code"),
                cell: ({ row }) => {
                  return (
                    <Badge variant="secondary">
                      {row.original?.currencyCode}
                    </Badge>
                  );
                },
              },
              {
                id: "status",
                header: t("Status"),
                cell: ({ row }) => {
                  const status = row.original?.active ? "active" : "inactive";

                  return (
                    <Badge
                      variant={status === "active" ? "success" : "secondary"}
                    >
                      {startCase(status)}
                    </Badge>
                  );
                },
              },
              {
                id: "menu",
                header: t("Menu"),
                cell: ({ row }) => {
                  return (
                    <div className="flex items-center gap-1">
                      <MethodUpdateForm row={row.original} />
                      <DeleteButton row={row.original} />
                    </div>
                  );
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
