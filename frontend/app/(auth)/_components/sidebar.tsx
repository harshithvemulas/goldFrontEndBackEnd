"use client";

import { useBranding } from "@/hooks/useBranding";
import { imageURL } from "@/lib/utils";

export function Sidebar() {
  const { authBanner } = useBranding();

  return (
    <div
      style={{
        backgroundImage: `url(${imageURL(authBanner)})`,
      }}
      className="hidden h-full w-full border-r bg-cover bg-no-repeat md:block md:max-w-[350px] lg:max-w-[510px]"
    />
  );
}
