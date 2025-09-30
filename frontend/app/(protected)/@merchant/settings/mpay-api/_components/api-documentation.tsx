"use client";

import CheckPaymentStatus from "@/app/(protected)/@merchant/settings/mpay-api/_components/check-payment-status";
import CreatePayment from "@/app/(protected)/@merchant/settings/mpay-api/_components/create-payment";
import Introduction from "@/app/(protected)/@merchant/settings/mpay-api/_components/introduction";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import { ArrowLeft2, HambergerMenu } from "iconsax-react";
import React from "react";
import { useTranslation } from "react-i18next";

type APIDocumentationType =
  | "INTRODUCTION"
  | "CREATE_PAYMENT"
  | "CHECK_PAYMENT_STATUS";

export default function APIDocumentation() {
  const [sidebar, setSidebar] = React.useState(true);
  const [active, setActive] =
    React.useState<APIDocumentationType>("INTRODUCTION");
  const { t } = useTranslation();
  const { width } = useDeviceSize();

  const menuItems: Array<{ title: string; key: APIDocumentationType }> = [
    {
      title: t("Introduction"),
      key: "INTRODUCTION",
    },
    {
      title: t("Create Payment"),
      key: "CREATE_PAYMENT",
    },
    {
      title: t("Check Payment Status"),
      key: "CHECK_PAYMENT_STATUS",
    },
  ];

  const content: Record<APIDocumentationType, JSX.Element> = {
    INTRODUCTION: <Introduction />,
    CREATE_PAYMENT: <CreatePayment />,
    CHECK_PAYMENT_STATUS: <CheckPaymentStatus />,
  };

  return (
    <div className="rounded-xl border border-border bg-background">
      <AccordionItem
        value="API_DOCUMENTATION"
        className="border-none px-4 py-0"
      >
        <AccordionTrigger className="py-6 hover:no-underline">
          <div className="flex items-center gap-1">
            <p className="text-base font-medium leading-[22px]">
              {t("API Documentation")}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 border-t border-divider px-1 pt-4">
          <div className="mb-4 flex items-center justify-start xl:hidden">
            <Button
              onClick={() => setSidebar((prev) => !prev)}
              variant="outline"
              size="sm"
              type="button"
              className="text-sm"
            >
              <HambergerMenu size="20" />
              {t("Menu")}
            </Button>
          </div>
          <div className="flex">
            <Sidebar sidebar={sidebar} setSidebar={setSidebar} width={width}>
              {menuItems.map((item) => (
                <button
                  data-active={active === item.key}
                  onClick={() => {
                    setActive(item.key);
                    setSidebar(false);
                  }}
                  type="button"
                  key={item.key}
                  className="flex w-full rounded-lg px-2 py-2 text-left transition-all duration-150 ease-in-out hover:bg-secondary data-[active=true]:bg-secondary"
                >
                  {item.title}
                </button>
              ))}
            </Sidebar>
            <div className="w-full px-2 py-2 md:w-[75%] md:px-4">
              {content[active]}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

export function Sidebar({
  children,
  sidebar,
  setSidebar,
  width,
}: {
  children: React.ReactNode;
  sidebar: boolean;
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  width: number;
}) {
  const { t } = useTranslation();

  return (
    <div
      data-expanded={width >= 1280 || (width < 1280 && sidebar)}
      className="absolute inset-y-0 right-0 top-0 z-50 w-full max-w-96 translate-x-full border-r bg-white p-6 pl-0 pt-0 transition-all duration-300 ease-in-out data-[expanded=true]:translate-x-0 xl:relative"
    >
      {/* sidebar close button */}
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => setSidebar(false)}
        className="mb-4 gap-[2px] bg-background text-sm hover:bg-background xl:hidden"
      >
        <ArrowLeft2 size={14} />
        {t("Hide menu")}
      </Button>
      {/* sidebar close button end */}

      {/* children data */}
      {children}
    </div>
  );
}
