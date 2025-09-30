import { Case } from "@/components/common/Case";
import { useTableData } from "@/hooks/useTableData";
import { imageURL } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { SavedItem } from "./saved-item";

export function FavoritesCard() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: savedList } = useTableData(`/saves?page=1&limit=6`);
  return (
    <div className="w-full flex-1 rounded-xl bg-background px-2 py-6 shadow-default xl:flex-auto">
      <p className="mb-4 px-4 font-semibold text-foreground">
        {t("Favorites")}
      </p>
      <Case condition={!!savedList?.length}>
        <div className="flex flex-col">
          {savedList?.map((item: Record<string, any>) => {
            if (item.type === "phone") {
              return (
                <SavedItem
                  key={item.id}
                  {...{
                    avatar: "",
                    name: item?.info ? JSON.parse(item.info)?.label : "",
                    email: item.value,
                    wallet: "",
                    onCallback: () =>
                      router.push(`/services/top-up?phone=${item.value}`),
                    callbackBtnLabel: t("Top-up money"),
                  }}
                />
              );
            }
            if (item.type === "wallet") {
              return (
                <SavedItem
                  key={item.id}
                  {...{
                    avatar: item?.info
                      ? imageURL(JSON.parse(item.info)?.image)
                      : "",
                    name: item?.info ? JSON.parse(item.info)?.label : "",
                    email: item?.info ? JSON.parse(item.info)?.email : "",
                    wallet: item?.metaData
                      ? JSON.parse(item.metaData)?.currency
                      : "",
                    onCallback: () => {
                      router.push(`/transfer?walletId=${item.value}`);
                    },
                    callbackBtnLabel: t("Transfer"),
                  }}
                />
              );
            }
            if (item.type === "merchant") {
              return (
                <SavedItem
                  key={item.id}
                  {...{
                    avatar: item?.info
                      ? imageURL(JSON.parse(item.info)?.image)
                      : "",
                    name: item?.info ? JSON.parse(item.info)?.label : "",
                    email: item?.info ? JSON.parse(item.info)?.email : "",
                    wallet: item?.metaData
                      ? JSON.parse(item.metaData)?.currency
                      : "",
                    onCallback: () => {
                      router.push(
                        `/payment?email=${JSON.parse(item.info)?.email}`,
                      );
                    },
                    callbackBtnLabel: t("Payment"),
                  }}
                />
              );
            }

            if (item.type === "electricity") {
              const biller = item?.metaData
                ? JSON.parse(item.metaData)?.billerId
                : "";

              const sp = new URLSearchParams();
              if (biller) sp.set("billerId", biller);
              sp.set("meterId", item.value);
              return (
                <SavedItem
                  key={item.id}
                  {...{
                    avatar: item?.info
                      ? imageURL(JSON.parse(item.info)?.image)
                      : "",
                    name: item?.info ? JSON.parse(item.info)?.label : "",
                    email: item.value,
                    wallet: "",
                    onCallback: () => {
                      router.push(
                        `/services/electricity-bill?${sp.toString()}`,
                      );
                    },
                    callbackBtnLabel: t("Pay bill"),
                  }}
                />
              );
            }
            return null;
          })}
        </div>
      </Case>
      <Case condition={savedList?.length === 0}>
        <p className="px-4 text-sm text-secondary-text">
          {t("No favorite item")}
        </p>
      </Case>
    </div>
  );
}
