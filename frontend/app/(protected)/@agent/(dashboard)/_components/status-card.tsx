import { Case } from "@/components/common/Case";
import cn from "@/lib/utils";
import { Icon } from "iconsax-react";
import { useTranslation } from "react-i18next";

type StatusCardProps = {
  isLoading: boolean;
  title: string;
  value: string | number;
  currency?: string;
  Icon: Icon;
  iconVariant?: "Outline" | "Bulk" | "Bold";
  iconContainerClass?: string;
};

export function StatusCard({
  isLoading,
  title,
  value,
  currency,
  Icon,
  iconVariant = "Bulk",
  iconContainerClass,
}: StatusCardProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full rounded-xl bg-background p-6 shadow-default md:max-w-[376px]">
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-4">
          <div
            className={cn(
              "flex h-[54px] w-[54px] items-center justify-center rounded-full bg-important/10",
              iconContainerClass,
            )}
          >
            <Icon size="32" variant={iconVariant} />
          </div>
          <div>
            <h6 className="mb-1 font-semibold text-warning">{t("Pending")}</h6>
            <p className="text-xs font-normal leading-4">{t(title)}</p>
          </div>
        </div>

        <Case condition={isLoading}>
          <div className="text-4xl font-semibold leading-[32px]">00</div>
        </Case>

        <Case condition={!isLoading}>
          <div className="text-xl font-semibold">
            {value}
            {currency ? (
              <span className="pl-1.5 text-xl">{currency}</span>
            ) : null}
          </div>
        </Case>
      </div>
    </div>
  );
}
