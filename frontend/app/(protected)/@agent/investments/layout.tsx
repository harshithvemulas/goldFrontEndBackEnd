import { Tabbar } from "@/app/(protected)/@customer/investments/_components/Tabbar";
import * as React from "react";

export default function InvestmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Tabbar />
      <div className="p-4">{children}</div>
    </div>
  );
}
