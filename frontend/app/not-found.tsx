"use client";

import { Navbar } from "@/app/(auth)/_components/navbar";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex h-screen flex-1 flex-col overflow-hidden bg-background">
        <Navbar path="/" />
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h1 className="mb-1 text-[28px] font-medium leading-10 md:text-[32px]">
              404
            </h1>
            <h2 className="mb-4 w-full text-center">
              {t("This page isn't here anymore.")}
            </h2>
            <div className="flex items-center gap-1">
              <p className="text-center text-sm font-normal text-secondary-text sm:text-base">
                {t("You can go back to the home page.")}
              </p>
              <Link href="/" className="text-primary-300 hover:underline">
                {t("Go back")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
