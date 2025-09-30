"use client";

import * as React from "react";

import { WebhookDetails } from "@/app/(protected)/@merchant/settings/webhook-url-settings/_components/webhook-details";
import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Separator from "@/components/ui/separator";
import { useTableData } from "@/hooks/useTableData";
import { SortingState } from "@tanstack/react-table";
import { Eye } from "iconsax-react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function WebHookURLSettings() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const searchParams = useSearchParams();

  const { t } = useTranslation();
  const { data, meta, isLoading } = useTableData(
    `/merchants/webhooks?page=${searchParams.get("page") ?? 1}&limit=${searchParams.get("limit") ?? 10}`,
  );
  return (
    <div className="flex flex-col gap-4">
      {/* Table */}
      <Card className="flex flex-col gap-4 rounded-xl p-4 shadow-default">
        <CardHeader className="justify-center p-0 sm:h-10">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <CardTitle className="text-base font-medium leading-[22px]">
              {t("Webhooks")}
            </CardTitle>
          </div>
        </CardHeader>

        <Separator className="mb-1 mt-[5px]" />
        <CardContent className="p-0">
          {/* webhook table */}

          <DataTable
            data={data}
            pagination={{
              total: meta?.total,
              page: meta?.currentPage,
              limit: meta?.perPage,
            }}
            structure={[
              {
                id: "type",
                header: t("Type"),
                cell: ({ row }) => {
                  const { type } = row.original;

                  return (
                    <div className="w-full text-sm font-normal leading-5 text-secondary-text">
                      {type}
                    </div>
                  );
                },
              },
              {
                id: "webhookUrl",
                header: t("Webhook URL"),
                cell: ({ row }) => {
                  const { webhookUrl } = row.original;
                  return (
                    <div className="w-full text-sm font-normal leading-5 text-secondary-text">
                      {webhookUrl}
                    </div>
                  );
                },
              },
              {
                id: "requestBody",
                header: t("Request Body"),
                cell: ({ row }) => {
                  const { requestBody } = row.original;
                  return (
                    <WebhookDetails
                      title={t("Request Body")}
                      body={requestBody}
                      trigger={
                        <Button
                          variant="outline"
                          className="bg-background px-4 py-2 text-base font-medium leading-[22px]"
                        >
                          <Eye />
                          <span>{t("View Details")}</span>
                        </Button>
                      }
                    />
                  );
                },
              },
              {
                id: "responseBody",
                header: t("Response Body"),
                cell: ({ row }) => {
                  const { responseBody } = row.original;

                  return (
                    <WebhookDetails
                      title={t("Response Body")}
                      body={responseBody}
                      trigger={
                        <Button
                          variant="outline"
                          className="bg-background px-4 py-2 text-base font-medium leading-[22px]"
                        >
                          <Eye />
                          <span>{t("View Details")}</span>
                        </Button>
                      }
                    />
                  );
                },
              },
              {
                id: "statusCode",
                header: t("Status"),
                cell: ({ row }) => {
                  const { statusCode } = row.original;
                  return (
                    <Badge variant={statusCode < 300 ? "success" : "error"}>
                      {statusCode}
                    </Badge>
                  );
                },
              },
            ]}
            sorting={sorting}
            setSorting={setSorting}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
