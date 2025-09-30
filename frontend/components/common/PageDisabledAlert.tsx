import cn from "@/lib/utils";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function PageDisabledAlert({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="w-full max-w-[600px] rounded-xl border bg-background p-10">
        <h3 className="mb-2.5">
          {t("This feature is temporarily unavailable")}
        </h3>
        <p className="text-sm text-secondary-text">
          {t(
            "You no longer have permission to use this feature. If you believe this is an error or require further assistance, please contact ",
          )}
          <Link
            href="/contact-supports"
            className="text-primary hover:underline"
          >
            {t("support")}
          </Link>
          .
        </p>
        <p className="mt-2 text-sm text-secondary-text">
          {t("Thank you for your understanding.")}
        </p>
      </div>
    </div>
  );
}
