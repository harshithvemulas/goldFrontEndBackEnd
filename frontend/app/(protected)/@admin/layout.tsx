import Header from "@/components/common/Header";
import AdminSidenav from "@/components/common/layout/AdminSidenav";
import React from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <AdminSidenav />
      <div className="relative h-full w-full overflow-hidden">
        <Header />
        <div className="h-[calc(100vh-76px)] overflow-y-auto overflow-x-hidden pb-20 md:pb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
