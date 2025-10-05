"use client";

import { Case } from "@/components/common/Case";
import DataTable from "@/components/common/DataTable";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Separator from "@/components/ui/separator";
import Switch from "@/components/ui/switch";
import { updateCurrencyIsActive } from "@/data/settings/updateCurrencyIsActive";
import { updateCurrencyIsCrypto } from "@/data/settings/updateCurrencyIsCrypto";
import { useTableData } from "@/hooks/useTableData";
import type { SortingState } from "@tanstack/react-table";
import { Add, ArrowLeft2, Edit2 } from "iconsax-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CurrencyForm } from "./_components/currency-form";

export default function Currencies() {
  const { t } = useTranslation();

  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, meta, isLoading, error, refresh } = useTableData(
    `/admin/currencies?${searchParams.toString()}`,
  );

  const handleIsActive = (id: number) => {
    toast.promise(updateCurrencyIsActive(id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        refresh();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  const handleIsCrypto = (id: number) => {
    toast.promise(updateCurrencyIsCrypto(id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        refresh();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  if (error) {
    return (
      <div className="w-full bg-danger py-2.5 text-danger-foreground">
        <p>
          {t(
            "We encountered an issue while retrieving the requested data. Please try again later or contact support if the problem persists.",
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-background p-4 shadow-default">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h5 className="font-base font-medium leading-[22px]">
          {t("Currencies")}
        </h5>
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="rounded-sm px-4 py-2 text-base font-medium leading-[22px]"
            >
              <Add />
              {t("Add Currency")}
            </Button>
          </DrawerTrigger>

          <DrawerContent className="inset-x-auto inset-y-0 bottom-auto left-auto right-0 top-0 m-0 flex h-full w-[95%] flex-col overflow-hidden rounded-t-none bg-white px-0 py-8 md:w-[400px]">
            <DrawerTitle className="flex items-center gap-4 px-6 text-base font-semibold">
              <DrawerClose asChild>
                <Button variant="outline" size="icon">
                  <ArrowLeft2 />
                </Button>
              </DrawerClose>
              {t("Add Currency")}
            </DrawerTitle>
            <DrawerDescription className="hidden" />
            <div className="h-full w-full flex-1 overflow-y-auto px-6 py-4">
              <CurrencyForm onMutate={refresh} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <Separator className="mb-1 mt-[5px] bg-divider-secondary" />
      <div className="mt-4">
        <Case condition={isLoading}>
          <div className="flex w-full items-center justify-center py-10">
            <Loader />
          </div>
        </Case>

        <Case condition={!isLoading && !meta?.total}>
          <div className="flex w-full items-center py-10">
            {t("No currency found")}
          </div>
        </Case>

        <Case condition={!isLoading && data}>
          <DataTable
            data={data}
            isLoading={isLoading}
            pagination={{
              total: meta?.total,
              page: meta?.currentPage,
              limit: meta?.perPage,
            }}
            structure={[
              {
                id: "name",
                header: t("Currency Name"),
                cell: ({ row }) => {
                  const data = row?.original;
                  return (
                    <span className="line-clamp-2 block min-w-28 font-normal text-secondary-text">
                      {data.name}
                    </span>
                  );
                },
              },
              {
                id: "code",
                header: t("Code"),
                cell: ({ row }) => {
                  const data = row?.original;
                  return (
                    <span className="line-clamp-2 block min-w-28 font-normal text-secondary-text">
                      {data.code}
                    </span>
                  );
                },
              },
              {
                id: "usdRate",
                header: t("USD Rate"),
                cell: ({ row }) => {
                  const data = row?.original;
                  return (
                    <span className="line-clamp-2 block min-w-28 font-normal text-secondary-text">
                      {data?.usdRate
                        ? `${parseFloat(data.usdRate).toFixed(2)} ${data?.code}`
                        : "N/A"}
                    </span>
                  );
                },
              },
              {
                id: "minAmount",
                header: t("Min. Amount"),
                cell: ({ row }) => {
                  const data = row?.original;
                  return (
                    <span className="line-clamp-2 block min-w-28 font-normal text-secondary-text">
                      {parseFloat(data.minAmount).toFixed(2)} {data?.code}
                    </span>
                  );
                },
              },
              {
                id: "maxAmount",
                header: t("Max. Amount"),
                cell: ({ row }) => {
                  const data = row?.original;
                  return (
                    <span className="line-clamp-2 block min-w-28 font-normal text-secondary-text">
                      {parseFloat(data.maxAmount).toFixed(2)} {data?.code}
                    </span>
                  );
                },
              },
              {
                id: "dailyTransferAmount",
                header: t("Daily Transfer Amount"),
                cell: ({ row }) => {
                  const data = row?.original;
                  return (
                    <span className="line-clamp-2 block min-w-28 font-normal text-secondary-text">
                      {parseFloat(data.dailyTransferAmount).toFixed(2)}{" "}
                      {data?.code}
                    </span>
                  );
                },
              },
              {
                id: "dailyTransferLimit",
                header: t("Daily Transfer Limit"),
                cell: ({ row }) => {
                  const data = row?.original;
                  return (
                    <span className="line-clamp-2 block min-w-28 font-normal text-secondary-text">
                      {data.dailyTransferLimit} {t("times")}
                    </span>
                  );
                },
              },
              {
                id: "kycLimit",
                header: t("Kyc Limit"),
                cell: ({ row }) => {
                  const data = row?.original;
                  return (
                    <span className="line-clamp-2 block min-w-28 font-normal text-secondary-text">
                      {data.kycLimit}
                    </span>
                  );
                },
              },
              {
                id: "active",
                header: t("Active"),
                cell: ({ row }) => {
                  const data = row?.original;
                  return (
                    <Switch
                      defaultChecked={data.active}
                      onCheckedChange={() => handleIsActive(data.id)}
                    />
                  );
                },
              },
              {
                id: "isCrypto",
                header: t("Crypto"),
                cell: ({ row }) => {
                  const data = row?.original;
                  return (
                    <Switch
                      defaultChecked={data.isCrypto}
                      onCheckedChange={() => handleIsCrypto(data.id)}
                    />
                  );
                },
              },
              {
                id: "edit",
                header: t("Edit"),
                cell: ({ row }) => {
                  const data = row?.original;
                  return (
                    <Drawer direction="right">
                      <DrawerTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Edit2 size="20" className="text-primary" />
                        </Button>
                      </DrawerTrigger>

                      <DrawerContent className="inset-x-auto inset-y-0 bottom-auto left-auto right-0 top-0 m-0 flex h-full w-[95%] flex-col overflow-x-hidden overflow-y-scroll rounded-t-none bg-white px-0 py-8 md:w-[400px]">
                        <DrawerTitle className="flex items-center gap-4 px-6 text-base font-semibold">
                          <DrawerClose asChild>
                            <Button variant="outline" size="icon">
                              <ArrowLeft2 />
                            </Button>
                          </DrawerClose>
                          {t("Edit Currency")}
                        </DrawerTitle>
                        <DrawerDescription className="px-6 py-4">
                          <CurrencyForm currency={data} onMutate={refresh} />
                        </DrawerDescription>
                      </DrawerContent>
                    </Drawer>
                  );
                },
              },
            ]}
            sorting={sorting}
            setSorting={setSorting}
            className="border-none py-2.5"
          />
        </Case>
      </div>
    </div>
  );
}
