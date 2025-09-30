"use client";

import GlobalLoader from "@/components/common/GlobalLoader";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticate, isLoading } = useAuth();
  const router = useRouter();
  const [render, setRender] = React.useState(false);

  React.useLayoutEffect(() => {
    if (!isLoading && isAuthenticate) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  React.useLayoutEffect(() => {
    if (!isLoading && !isAuthenticate) {
      setRender(true);
    }
  }, [isLoading, isAuthenticate]);

  if (!render) return <GlobalLoader />;

  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Right Side */}
      <div className="flex h-full w-full flex-col bg-background">
        <Navbar path="/signin" />
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
