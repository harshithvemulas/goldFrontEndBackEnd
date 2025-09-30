import { Button } from "@/components/ui/button";
import { Edit2, TickCircle } from "iconsax-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

type Method = {
  name: string;
  logo?: string;
};

export function SelectedMethodPreview({
  method,
  onEdit,
}: {
  method: Method;
  onEdit: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="col-span-12">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="inline-flex w-full items-center justify-between gap-2 md:justify-start">
          <div className="flex items-center gap-2 rounded-xl border px-3 py-2.5">
            {method.logo && (
              <Image
                src={method.logo}
                alt={method.name}
                width={100}
                height={100}
                className="size-8 rounded-lg"
              />
            )}
            <span className="font-semibold capitalize">{method?.name}</span>
          </div>
          <div className="flex items-center gap-2.5 pl-2.5">
            <TickCircle size="16" className="text-primary" variant="Bold" />
            {t("Selected")}
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-2 font-medium"
          onClick={onEdit}
        >
          {t("Change")}
          <Edit2 size={16} />
        </Button>
      </div>
    </div>
  );
}
