import DataTable from "@/components/common/DataTable";
import { useBranding } from "@/hooks/useBranding";
import { useTranslation } from "react-i18next";

export default function CheckPaymentStatus() {
  const { t } = useTranslation();
  const branding = useBranding();

  return (
    <div>
      <div className="mb-4">
        <p className="mb-2 text-base font-medium leading-[22px]">
          {t("Check Payment Status")}
        </p>
        <p>
          {t(
            "This operation is used to get the status of a payment request. TrxId is the id received after request to payment has been successful.",
          )}
        </p>
      </div>
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium leading-[22px]">
          {t("Request URL")}
        </p>
        <p>
          <code className="rounded-[4px] border border-border bg-background px-2 py-1 text-sm">
            GET {branding?.apiUrl}/mapi/payment/:trxId
          </code>
        </p>
      </div>
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium leading-[22px]">
          {t("Headers")}
        </p>
        <DataTable
          className="border"
          data={[1]}
          structure={[
            {
              id: "name",
              header: t("Name"),
              cell: () => <p className="font-normal">{t("Authorization")}</p>,
            },
            {
              id: "value",
              header: t("Value"),
              cell: () => (
                <p className="font-normal">
                  {t(
                    "Bearer API_KEY (replace API_KEY with your actual API key).",
                  )}
                </p>
              ),
            },
          ]}
        />
      </div>
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium leading-[22px]">
          {t("Responses")}
        </p>
        <p className="mb-2 text-sm font-medium leading-[22px]">200 OK</p>

        <pre className="mb-2 overflow-x-auto rounded-[4px] border border-border bg-background p-4">
          <code>
            {`{
  "trxId": string,
  "type": "payment",
  "paymentAmount": number,
  "paymentFee": number,
  "amountAfterProcessing": number,
  "status": "pending" | "completed" | "failed",
  "currency": string,
  "logo": string,
  "successUrl": string,
  "cancelUrl": string,
  "sandbox": boolean,
  "custom": object,
  "createdAt": DateTime,
  "merchant": {
    "name": string,
    "email": string
  }
}
`}
          </code>
        </pre>
      </div>
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium leading-[22px]">
          {t("401 Unauthorized")}
        </p>

        <pre className="mb-2 overflow-x-auto rounded-[4px] border border-border bg-background p-4">
          <code>
            {`{
  "success": boolean,
  "message": string
}
`}
          </code>
        </pre>
      </div>
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium leading-[22px]">
          {t("500 Internal Server Error")}
        </p>

        <pre className="mb-2 overflow-x-auto rounded-[4px] border border-border bg-background p-4">
          <code>
            {`{
  "message": "string"
}
`}
          </code>
        </pre>
      </div>
    </div>
  );
}
