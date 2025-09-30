import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function MpayHead({ data }: { data: any }) {
  const { t } = useTranslation();
  return (
    <>
      <div className="mb-3 flex flex-col items-center">
        {data?.logo && (
          <Image
            src={data?.logo}
            alt="Merchant Logo"
            className="mb-3"
            width={200}
            height={80}
          />
        )}
        <h2>
          {t("Pay")} {data?.paymentAmount}{" "}
          <span className="font-normal text-slate-500">{data?.currency}</span>
        </h2>
        <p>
          <span className="text-slate-500">{t("to")}</span>{" "}
          {data?.merchant?.name}
        </p>
      </div>
      <hr />
    </>
  );
}
