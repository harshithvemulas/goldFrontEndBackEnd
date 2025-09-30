"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { ReportCard } from "@/components/common/ReportCard";
import { useSWR } from "@/hooks/useSWR";
import {
  Add,
  ArrowRight,
  Profile2User,
  Receive,
  Repeat,
  ShoppingCart,
  TagUser,
} from "iconsax-react";
import { useTranslation } from "react-i18next";
import { RecentRegisteredCard } from "./_components/recent-registered-card";
import { RecentTransactionGraph } from "./_components/recent-transaction-graph";
import TableSlot from "./_components/table-slot";

export default function DashboardPage() {
  const { data: count, isLoading: isCounting } = useSWR(
    "/admin/users/total-count/dashboard",
  );
  const { data: customers, isLoading: customersLoading } = useSWR(
    "/admin/users?page=1&limit=10",
  );
  const { t } = useTranslation();

  return (
    <main className="p-4">
      {/* statistics card */}
      <Case condition={isCounting}>
        <div className="flex items-center justify-center py-10">
          <Loader />
        </div>
      </Case>
      <Case condition={!isCounting}>
        <div className="grid grid-cols-12 gap-4">
          <ReportCard
            {...{
              icon: (props) => <Add {...props} />,
              title: t("Total Deposits"),
              value: isCounting ? 0 : count?.data?.deposit,
              status: `${count?.data?.depositAmount.toLocaleString()} USD`,
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
              iconClass: "bg-spacial-green-foreground text-spacial-green",
              statusClass: "text-spacial-green",
            }}
          />

          <ReportCard
            {...{
              icon: (props) => <Receive {...props} />,
              title: t("Total Withdraws"),
              value: isCounting ? 0 : count?.data?.withdraw,
              status: `${count?.data?.withdrawAmount.toLocaleString()} USD`,
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
              iconClass: "bg-spacial-red-foreground text-spacial-red",
              statusClass: "text-spacial-red",
            }}
          />
          <ReportCard
            {...{
              icon: (props) => <ArrowRight {...props} />,
              title: t("Total Transfers"),
              value: isCounting ? 0 : count?.data?.transfer,
              status: `${count?.data?.transferAmount.toLocaleString()} USD`,
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
              iconClass: "bg-spacial-blue-foreground text-spacial-blue",
              statusClass: "text-spacial-blue",
            }}
          />
          <ReportCard
            {...{
              icon: (props) => <Repeat {...props} />,
              title: t("Total Exchanges"),
              value: isCounting ? 0 : count?.data?.exchange,
              status: `${count?.data?.exchangeAmount.toLocaleString()} USD`,
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            }}
          />
          <ReportCard
            {...{
              icon: (props) => <Profile2User {...props} />,
              title: t("Customers"),
              value: isCounting ? 0 : count?.data?.customer?.total,
              status: isCounting
                ? "0 New"
                : `${count?.data?.customer?.total} New`,
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
              statusClass: "text-spacial-green",
            }}
          />
          <ReportCard
            {...{
              icon: (props) => <ShoppingCart {...props} />,
              title: t("Merchants"),
              value: isCounting ? 0 : count?.data?.merchant?.total,
              status: isCounting
                ? "0 New"
                : `${count?.data?.merchant?.total} New`,
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
              statusClass: "text-spacial-green",
            }}
          />
          <ReportCard
            {...{
              icon: (props) => <TagUser {...props} />,
              title: t("Agents"),
              value: isCounting ? 0 : count?.data?.agent?.total,
              status: isCounting ? "0 New" : `${count?.data?.agent?.total} New`,
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
              statusClass: "text-spacial-red",
            }}
          />
        </div>
      </Case>

      <div className="flex flex-col items-start gap-4 py-4 xl:flex-row">
        <div className="flex w-full flex-col gap-4 xl:flex-1">
          {/* Chart */}
          <RecentTransactionGraph />
          {/* Table */}
          <TableSlot />
        </div>

        <div className="w-full xl:w-[350px]">
          <div className="flex flex-col gap-4 rounded-xl bg-background p-6 shadow-default">
            <h3>{t("Recently registered")}</h3>
            <div className="flex flex-col gap-4">
              {!customersLoading
                ? customers?.data?.data?.map((customer: Record<string, any>) =>
                    customer.roleId === 1 ? null : (
                      <RecentRegisteredCard
                        key={customer.id}
                        {...{
                          name: customer?.customer?.name,
                          email: customer?.email,
                          userId: customer?.id,
                          isActive: customer?.status,
                          image: customer?.customer?.profileImage,
                        }}
                      />
                    ),
                  )
                : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
