import { useTranslation } from "react-i18next";

export default function MpayFooter({ data }: { data: any }) {
  const { t } = useTranslation();
  return (
    <div className="mt-6 text-center">
      <p className="text-slate-500">
        {t("For any issues please contact at")}{" "}
        <a href={`mailto:${data?.merchant?.email}`} className="text-blue-500">
          {data?.merchant?.email}
        </a>
      </p>
    </div>
  );
}
