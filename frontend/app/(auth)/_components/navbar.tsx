"use client";

import { Case } from "@/components/common/Case";
import { LangSwitcher } from "@/components/common/LangSwitcher";
import { Button } from "@/components/ui/button";
import { useBranding } from "@/hooks/useBranding";
import { imageURL } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { useTranslation } from "react-i18next";

export function Navbar({ path }: { path: string }) {
  const segment = useSelectedLayoutSegment();
  const pathname = usePathname();
  const {
    logo,
    siteName,
    customerRegistration,
    merchantRegistration,
    agentRegistration,
  } = useBranding();
  const { t } = useTranslation();

  const enabledRegistrations = [
    { type: "customer", enabled: customerRegistration },
    { type: "merchant", enabled: merchantRegistration },
    { type: "agent", enabled: agentRegistration },
  ];

  const enabledCount = enabledRegistrations.filter((r) => r.enabled).length;

  const getRegistrationPath = () => {
    if (enabledCount === 1) {
      const enabledType = enabledRegistrations.find((r) => r.enabled);
      return `/register/${enabledType?.type}?`;
    }

    return "/register";
  };

  return (
    <>
      {/* Head */}
      <div className="flex min-h-16 items-center justify-between gap-4 border-b px-4">
        <Link href={path}>
          <Image
            src={imageURL(logo)}
            width={160}
            height={40}
            alt={siteName}
            className="max-h-10 object-contain"
          />
        </Link>

        <div className="flex items-center">
          <div className="hidden items-center md:flex">
            <Case condition={segment === "signin"}>
              <Case condition={enabledCount > 0}>
                <span className="hidden xl:inline-block">
                  {t("Don’t have an account?")}
                </span>
                <Button
                  variant="secondary"
                  className="mx-2.5 rounded-2xl px-6"
                  asChild
                >
                  <Link href={getRegistrationPath()} prefetch={false}>
                    {t("Sign up")}
                    <ChevronRight size={15} />
                  </Link>
                </Button>
              </Case>
            </Case>

            <Case condition={pathname === "/register"}>
              <>
                <span className="hidden xl:inline-block">
                  {t("Have an account?")}
                </span>
                <Button
                  variant="secondary"
                  className="mx-2.5 rounded-2xl px-6"
                  asChild
                >
                  <Link href="/signin" prefetch={false}>
                    {t("Sign in")}
                    <ChevronRight size={15} />
                  </Link>
                </Button>
              </>
            </Case>
          </div>

          {/* language */}
          <LangSwitcher
            triggerClassName="flex min-w-fit w-fit items-center gap-2 font-medium text-sm rounded-2xl bg-secondary px-6 h-10 transition duration-300 ease-in-out hover:bg-secondary-500"
            arrowClassName="size-4"
          />
        </div>
      </div>
    </>
  );
}
