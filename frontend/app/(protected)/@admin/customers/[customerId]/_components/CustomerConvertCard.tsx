import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { ArrowRight2, User } from "iconsax-react";
import { useTranslation } from "react-i18next";

export default function CustomerConvertCard() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col items-center rounded-xl border border-border bg-background px-6 py-4">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-selected text-primary">
        <User variant="Bold" size={32} />
      </div>
      <Separator className="mb-1 mt-[5px] bg-border" />

      <div className="mt-2 px-2">
        <Button variant="secondary" disabled className="rounded-xl">
          {t("Convert to Customer")}
          <ArrowRight2 size={16} />
        </Button>
      </div>
    </div>
  );
}
