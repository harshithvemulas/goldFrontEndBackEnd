"use client";

import { MailSendBox } from "@/components/common/form/MailSendBox";
import Separator from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export default function CustomerSupport() {
  const { t } = useTranslation();

  return (
    <div className="m-4 rounded-xl bg-background p-4 md:p-10">
      <h2 className="mb-1">{t("Need Help?")}</h2>
      <p className="text-sm text-secondary-text">
        {t(
          "We're here to assist you with any questions or issues you may encounter. Please feel free to contact our support team by emailing:",
        )}
      </p>

      <Separator className="my-6" />

      <div className="mb-6 rounded-md bg-info/20 p-4 text-sm">
        {t(
          "For faster assistance, please provide as much detail as possible about your issue, including screenshots or error messages if applicable. Our support hours are 24/7.",
        )}
      </div>

      {/* mail send box */}
      <MailSendBox />
    </div>
  );
}
