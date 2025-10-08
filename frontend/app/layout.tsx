"use client";

import GlobalLoader from "@/components/common/GlobalLoader";
import ScrollToTop from "@/components/common/ScrollToTop";
import Provider from "@/contexts/Provider";
import { useSWR } from "@/hooks/useSWR";
import { imageURL } from "@/lib/utils";
import { ProgressProvider } from "@bprogress/next/app";
import { Poppins } from "next/font/google";
import React from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "sonner";
import "./globals.scss";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useTranslation();
  const { data: branding, isLoading: brandingLoading } = useSWR(
    "/settings/global/branding",
    {
      revalidateOnFocus: false,
    },
  );
  if (brandingLoading)
    return (
      <html lang="en">
        <head>
          <title>{t("Loading...")}</title>
        </head>
        <body>
          <GlobalLoader />
        </body>
      </html>
    );
  return (
    <html dir="ltr" lang="en">
      <head>
        <title>{branding?.data?.siteName}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link
          rel="icon"
          href={imageURL(branding?.data?.favicon)}
          type="image/png"
        />
      </head>
      <body
  className={`${poppins.className} ${poppins.variable}`}
      >
        <ProgressProvider
          height="3px"
          color="#01a79e"
          options={{ showSpinner: false }}
          shallowRouting
        >
          <Provider>
            <Toaster
              toastOptions={{
                closeButton: true,
                classNames: {
                  error:
                    "toast bg-danger/90 text-danger-foreground border-danger/40",
                  success:
                    "toast bg-success/90 text-success-foreground border-success/40",
                  warning:
                    "toast bg-warning/90 text-warning-foreground border-warning/40",
                  info: "toast bg-info/90 text-info-foreground border-info/40",
                  closeButton: "bg-background text-foreground border-2",
                },
              }}
            />
            {children}
            <ScrollToTop />
          </Provider>
        </ProgressProvider>
      </body>
    </html>
  );
}
