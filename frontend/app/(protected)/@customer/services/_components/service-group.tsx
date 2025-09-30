import React from "react";

export function ServiceGroup({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">{children}</div>
    </div>
  );
}
