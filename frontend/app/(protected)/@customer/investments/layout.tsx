import * as React from "react";

import { Tabbar } from "./_components/Tabbar";

export default function InvestmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Tabbar />
      <div className="p-4 pb-20 md:pb-0">{children}</div>
    </div>
  );
}
