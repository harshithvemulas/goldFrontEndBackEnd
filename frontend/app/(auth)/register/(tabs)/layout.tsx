"use client";

import { Case } from "@/components/common/Case";
import { usePathname } from "next/navigation";
import * as React from "react";

export default function AuthLayout({
  children,
  customer,
  merchant,
  agent,
}: {
  children: React.ReactNode;
  customer: React.ReactNode;
  merchant: React.ReactNode;
  agent: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="my-10 flex-1 overflow-y-auto px-0 py-6 md:px-6">
      <Case condition={pathname === "/register"}>{children}</Case>
      <Case condition={pathname.startsWith("/register/customer")}>
        <React.Suspense>{customer}</React.Suspense>
      </Case>
      <Case condition={pathname.startsWith("/register/merchant")}>
        <React.Suspense> {merchant}</React.Suspense>
      </Case>
      <Case condition={pathname.startsWith("/register/agent")}>
        <React.Suspense> {agent}</React.Suspense>
      </Case>
    </div>
  );
}
