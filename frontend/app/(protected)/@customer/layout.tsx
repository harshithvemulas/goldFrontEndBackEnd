import Header from "@/components/common/Header";
import SideNav from "@/components/common/SideNav";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <SideNav userRole="customer" />
      <div className="relative h-full w-full overflow-hidden">
        <Header />
        <div className="h-[calc(100vh-76px)] overflow-y-auto overflow-x-hidden pb-20 md:pb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
