"use client";

import { Loader } from "@/components/common/Loader";
import SavedMerchantAccount from "@/components/common/SavedMerchantAccount";
import { useSWR } from "@/hooks/useSWR";
import { useTranslation } from "react-i18next";

export function SavedMerchant({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (value: string, data?: any) => void;
}) {
  const { t } = useTranslation();
  const { data, error, isLoading } = useSWR("/merchants/saved");

  // if error occurred...
  if (error) {
    return (
      <div className="rounded-lg bg-destructive text-destructive-foreground">
        {t(
          "An unexpected error occurred. Please try reloading the page or contacting our administrator for assistance.",
        )}
      </div>
    );
  }

  // loading...
  if (isLoading) {
    return <Loader title={t("Loading...")} />;
  }

  // if data exist
  if (data?.data.length > 0) {
    const merchants = data?.data;

    const getInfo = (merchant: any) => {
      return JSON.parse(merchant.info);
    };

    return merchants.map((merchant: any) => (
      <div key={merchant.id}>
        <SavedMerchantAccount
          {...{
            avatar: getInfo(merchant)?.image,
            name: getInfo(merchant)?.label,
            accountNumber: merchant?.value,
            checked: value === merchant?.value,
            onChange: (value) =>
              onSelect(value, {
                ...merchant,
                info: getInfo(merchant),
              }),
          }}
        />
      </div>
    ));
  }

  return (
    <p className="text-sm font-medium text-foreground/50">
      {t("No data found")}
    </p>
  );
}
