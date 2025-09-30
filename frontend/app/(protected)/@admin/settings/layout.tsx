import * as React from "react";

import { Tabbar } from "./_components/Tabbar";

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-y-auto">
      <Tabbar />
      <div className="p-4">{children}</div>
    </div>
  );
}
