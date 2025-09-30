import React from "react";
import { Tabbar } from "./_components/Tabbar";

export const runtime = "edge";

export default function CustomerDetailsLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <>
      <Tabbar />
      {children}
    </>
  );
}
