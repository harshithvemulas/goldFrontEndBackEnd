import { ReactNode } from "react";

export const runtime = "edge";

export default function TransactionDetailsLayout({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  return children;
}
