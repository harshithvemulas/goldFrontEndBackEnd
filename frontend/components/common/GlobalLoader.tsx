"use client";

import { Loader } from "@/components/common/Loader";
import cn from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function GlobalLoader({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "absolute inset-0 left-0 top-0 z-[999] flex h-screen w-screen items-center justify-center overflow-hidden bg-background",
        className,
      )}
    >
      <Loader title={t("Loading...")} className="text-foreground" />
    </div>
  );
}
