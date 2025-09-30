import { useTranslation } from "react-i18next";

export default function Introduction() {
  const { t } = useTranslation();
  return (
    <div>
      <p className="mb-2 text-base font-medium leading-[22px]">
        {t("Introduction")}
      </p>
      <p>
        {t(
          "Learn how to integrate the Merchant Payment API to receive payments from your customer in your own platform/system.",
        )}
      </p>
    </div>
  );
}
