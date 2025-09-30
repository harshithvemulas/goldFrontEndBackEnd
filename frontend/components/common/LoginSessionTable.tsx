import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActionMenu } from "../../app/(protected)/@admin/settings/login-sessions/action-menu";

export default function LoginSessionTable({ data, meta, isLoading }: any) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslation();

  return (
    <DataTable
      data={data}
      sorting={sorting}
      isLoading={isLoading}
      setSorting={setSorting}
      pagination={{
        total: meta?.total,
        page: meta?.page,
        limit: meta?.limit,
      }}
      structure={[
        {
          id: "logged in",
          header: t("Logged in"),
          cell: (args: any) => {
            const { createdAt } = args.row.original;

            if (!createdAt)
              return (
                <span className="font-normal text-secondary-text"> N/A </span>
              );

            return (
              <p className="block min-w-24 text-sm font-normal text-secondary-text">
                {format(createdAt, "dd MMM yyyy; hh:mm b")}
              </p>
            );
          },
        },

        {
          id: "ipAddress",
          header: t("IP Address"),
          cell: (args: any) => {
            if (!args.row.original?.ipAddress)
              return (
                <span className="font-normal text-secondary-text"> N/A </span>
              );

            return (
              <div className="font-normal text-secondary-text">
                {args.row.original?.ipAddress}
              </div>
            );
          },
        },
        {
          id: "country",
          header: t("Country"),
          cell: (args: any) => {
            if (!args.row.original?.country)
              return (
                <span className="font-normal text-secondary-text"> N/A </span>
              );

            return (
              <div className="font-normal text-secondary-text">
                {args.row.original?.country}
              </div>
            );
          },
        },
        {
          id: "deviceName",
          header: t("Device"),
          cell: (args: any) => {
            if (!args.row.original?.deviceName)
              return (
                <span className="font-normal text-secondary-text"> N/A </span>
              );

            return (
              <div className="font-normal text-secondary-text">
                {args.row.original?.deviceName}
              </div>
            );
          },
        },

        {
          id: "active",
          header: t("Status"),
          cell: (args: any) => {
            if (!args.row.original?.active)
              return (
                <Badge variant="secondary" className="bg-muted">
                  {t("Inactive")}
                </Badge>
              );

            return <Badge variant="success">{t("Active")}</Badge>;
          },
        },

        {
          id: "menu",
          header: t("Menu"),
          cell: (args: any) => <ActionMenu row={args.row.original} />,
        },
      ]}
    />
  );
}
