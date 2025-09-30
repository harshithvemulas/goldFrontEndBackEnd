import * as React from "react";

import { Tabbar } from "./_components/Tabbar";

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Tabbar />
      <div className="p-4 md:pb-20">{children}</div>
    </div>
  );
}
