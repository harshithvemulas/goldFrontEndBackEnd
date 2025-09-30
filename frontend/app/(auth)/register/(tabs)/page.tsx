"use client";

import { AuthPageHeading } from "@/app/(auth)/_components/heading";
import { HandshakeIcon } from "@/components/icons/HandshakeIcon";
import ShoppingCardIcon from "@/components/icons/ShoppingCardIcon";
import { UserIcon } from "@/components/icons/UserIcon";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { useBranding } from "@/hooks/useBranding";
import { ArrowRight } from "iconsax-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

export default function RegistrationPage() {
  const { t } = useTranslation();
  const {
    siteName,
    customerRegistration,
    merchantRegistration,
    agentRegistration,
  } = useBranding();

  const registrationRoles = [
    {
      type: "customer",
      enabled: customerRegistration,
      title: t("Customer"),
      description: t(
        "Deposit, transfer, withdraw, invest, pay online, and exchange money easily.",
      ),
      icon: (
        <div className="grid size-16 place-items-center rounded-full bg-primary-selected">
          <UserIcon className="fill-primary" />
        </div>
      ),
    },
    {
      type: "merchant",
      enabled: merchantRegistration,
      title: t("Merchant"),
      description: t(
        "Accept payments online, request payments, and manage finances seamlessly.",
      ),
      icon: (
        <div className="grid size-16 place-items-center rounded-full bg-[#EAF6FF]">
          <ShoppingCardIcon className="fill-[#09A7FF]" />
        </div>
      ),
    },
    {
      type: "agent",
      enabled: agentRegistration,
      title: t("Agent"),
      description: t(
        "Help customers deposit and withdraw money while earning commissions.",
      ),
      icon: (
        <div className="grid size-16 place-items-center rounded-full bg-[#FFE9E9]">
          <HandshakeIcon />
        </div>
      ),
    },
  ];

  const enabledCount = registrationRoles.filter((r) => r.enabled).length;

  return (
    <div className="container w-full max-w-[716px]">
      <AuthPageHeading
        title={t("Create an account")}
        subTitle={t("Welcome to {{siteName}}, let's get start", { siteName })}
      />

      <div className="my-6 flex h-[5px] items-center">
        <Separator className="bg-divider" />
      </div>

      <p className="mb-4 text-base font-medium leading-[22px]">
        {enabledCount > 0
          ? t("I am a...")
          : t("Registration is currently disabled")}
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {registrationRoles
          .filter((role) => role.enabled)
          .map((role) => (
            <RegisterTypeCard
              key={role.type}
              type={role.type}
              icon={role.icon}
              title={role.title}
              description={role.description}
            />
          ))}
      </div>
    </div>
  );
}

function RegisterTypeCard({
  type,
  icon,
  title,
  description,
}: {
  type: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const sp = useSearchParams();

  return (
    <Link href={`/register/${type}?${sp.toString()}`} prefetch={false}>
      <div className="group relative h-full rounded-xl px-6 py-4 shadow-defaultLite transition-shadow duration-200 hover:shadow-light-8">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-4 invisible absolute right-3 top-3 h-8 w-8 p-1.5 group-hover:visible"
        >
          <ArrowRight size="20" />
        </Button>
        <div className="flex w-full flex-col items-center gap-4">
          {icon}
          <h5 className="text-base font-medium leading-[22px]">{title}</h5>
          <p className="text-center text-sm text-secondary-text">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
