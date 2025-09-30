"use client";

import DataTable from "@/components/common/DataTable";
import { Currency, imageURL, shapePhoneNumber } from "@/lib/utils";
import { SortingState } from "@tanstack/react-table";
import { User } from "iconsax-react";
import { parsePhoneNumber } from "libphonenumber-js";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

const currency = new Currency();

export function ReferralTable({
  referralUsers,
  isLoading,
}: {
  referralUsers: any;
  isLoading: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { t } = useTranslation();

  return (
    <DataTable
      data={referralUsers}
      sorting={sorting}
      setSorting={setSorting}
      isLoading={isLoading}
      structure={[
        {
          id: "name",
          header: t("Name"),
          cell: ({ row }) => {
            const data = row?.original;
            return (
              <div className="flex min-w-28 items-center gap-2.5 font-normal">
                {data?.customer?.profileImage ? (
                  <Image
                    src={imageURL(data?.customer?.profileImage)}
                    alt={data?.customer?.name}
                    className="size-8 rounded-full"
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                    <User
                      size="16"
                      variant="Bold"
                      className="text-secondary-text"
                    />
                  </div>
                )}
                <span>{data?.customer?.name}</span>
              </div>
            );
          },
        },
        {
          id: "contact_number",
          header: t("Contact Number"),
          cell: ({ row }) => {
            const data = row?.original;
            const phone = parsePhoneNumber(
              shapePhoneNumber(data?.customer?.phone),
            );
            return (
              <span className="block min-w-32 font-normal text-secondary-text">
                {phone.formatInternational()}
              </span>
            );
          },
        },
        {
          id: "email",
          header: t("Email"),
          cell: ({ row }) => {
            const data = row?.original;
            return (
              <span className="font-normal text-secondary-text">
                {data?.email}
              </span>
            );
          },
        },
        {
          id: "totalBonus",
          header: t("Total bonus"),
          cell: ({ row }) => {
            const data = row?.original;
            return (
              <span className="font-normal text-secondary-text">
                {currency.format(data?.totalBonus)}
              </span>
            );
          },
        },
      ]}
    />
  );
}
