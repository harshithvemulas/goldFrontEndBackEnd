import * as React from "react";

import { Tabbar } from "./_components/Tabbar";

export default function InvestmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full overflow-y-auto">
      <Tabbar />
      {children}
    </div>
  );
}
