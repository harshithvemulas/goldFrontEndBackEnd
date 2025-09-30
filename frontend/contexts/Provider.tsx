"use client";

import GoogleAnalytics4 from "@/components/common/plugins/GoogleAnalytics4";
import TawkChat from "@/components/common/plugins/TawkChat";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import i18n from "@/lib/i18n";
import { usePathname } from "next/navigation";
import * as React from "react";
import { I18nextProvider } from "react-i18next";
import GlobalProvider from "./GlobalProvider";

export default function Provider({ children }: { children: React.ReactNode }) {
  const { width } = useDeviceSize();
  const pathname = usePathname();

  const mobileVisibleRoutes = ["/contact-supports"];

  const shouldShowTawkChat =
    width >= 640 || (width < 640 && mobileVisibleRoutes.includes(pathname));

  return (
    <I18nextProvider i18n={i18n}>
      <GlobalProvider>
        {children}
        {shouldShowTawkChat && <TawkChat />}
        <GoogleAnalytics4 />
      </GlobalProvider>
    </I18nextProvider>
  );
}
