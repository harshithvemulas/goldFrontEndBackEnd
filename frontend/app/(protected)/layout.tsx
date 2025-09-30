"use client";

import GlobalLoader from "@/components/common/GlobalLoader";
import { useAuth } from "@/hooks/useAuth";
import React, { Suspense } from "react";

export default function ProtectedLayout({
  admin,
  customer,
  agent,
  merchant,
}: {
  admin: React.ReactNode;
  customer: React.ReactNode;
  agent: React.ReactNode;
  merchant: React.ReactNode;
}) {
  const { auth } = useAuth();

  let page;
  switch (auth?.role.id) {
    case 1:
      page = admin;
      break;
    case 2:
      page = customer;
      break;
    case 3:
      page = merchant;
      break;
    case 4:
      page = agent;
      break;
    default:
      page = <GlobalLoader />;
  }

  return <Suspense fallback={<GlobalLoader />}>{page}</Suspense>;
}
