import { ReactNode } from "react";

export const runtime = "edge";

export default function ExchangeLayout({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  return children;
}
