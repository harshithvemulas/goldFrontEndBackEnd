import React from "react";

export function Case({
  condition,
  children,
}: {
  condition: boolean;
  children: React.ReactNode;
}) {
  if (!condition) return null;
  return children;
}
