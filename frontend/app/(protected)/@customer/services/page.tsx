"use client";

import { PageDisabledAlert } from "@/components/common/PageDisabledAlert";
import { ElectricityBillIcon } from "@/components/icons/ElectricityBillIcon";
import { TopupServiceIcon } from "@/components/icons/TopupServiceIcon";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { ServiceCard } from "./_components/service-card";
import { ServiceGroup } from "./_components/service-group";

export default function ServicesPage() {
  const { auth } = useAuth();
  const { t } = useTranslation();

  // if user has no access this feature
  if (!auth?.canMakePayment()) {
    return <PageDisabledAlert className="flex-1 p-10" />;
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-background p-4">
      <div className="flex flex-col gap-14">
        <ServiceGroup>
          <ServiceCard
            href="/services/top-up"
            icon={<TopupServiceIcon />}
            serviceName={t("Top-up")}
            description="Recharge your mobile in seconds!"
          />

          <ServiceCard
            href="/services/electricity-bill"
            icon={<ElectricityBillIcon />}
            serviceName={t("Electricity bill")}
            description="Skip the queues and pay your electricity bills from the comfort of your home. "
          />
        </ServiceGroup>
      </div>
    </div>
  );
}
