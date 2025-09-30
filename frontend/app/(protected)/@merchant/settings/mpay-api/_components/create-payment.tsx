import DataTable from "@/components/common/DataTable";
import { useBranding } from "@/hooks/useBranding";
import { useTranslation } from "react-i18next";

export default function CreatePayment() {
  const { t } = useTranslation();
  const branding = useBranding();

  const paymentParams = [
    {
      name: "amount",
      type: "number",
      mandatory: t("Yes"),
      description: t("amount to be received"),
    },
    {
      name: "currency",
      type: "string",
      mandatory: t("Yes"),
      description: t("a value compatible with {{name}} supported currencies", {
        name: branding?.siteName,
      }),
    },
    {
      name: "logo",
      type: "string (URL)",
      mandatory: t("Yes"),
      description: t(
        "An URL to your logo. It'll be shown on the payment page.",
      ),
    },
    {
      name: "callbackUrl",
      type: "string (URL)",
      mandatory: t("Yes"),
      description: t(
        "An URL to receive webhook callback about payment status.",
      ),
    },
    {
      name: "successUrl",
      type: "string (URL)",
      mandatory: t("Yes"),
      description: t(
        "An URL to redirect the customer after payment is completed.",
      ),
    },
    {
      name: "cancelUrl",
      type: "string (URL)",
      mandatory: t("Yes"),
      description: t(
        "An URL to redirect the customer after payment is cancelled/failed.",
      ),
    },
    {
      name: "sandbox",
      type: "boolean",
      mandatory: t("Yes"),
      description: t(
        'Set it to "true" to test payment integration during development phase. Otherwise keep it "false" to take real payments.',
      ),
    },
    {
      name: "custom",
      type: "object",
      mandatory: t("No"),
      description: t(
        "A custom object where you can add your custom data like customer email or transaction ID to verify the payment from your side. This field will be sent during webhook callbacks.",
      ),
    },
    {
      name: "customerName",
      type: "string",
      mandatory: t("Yes"),
      description: "Customer name for identification purpose.",
    },
    {
      name: "customerEmail",
      type: "string",
      mandatory: t("Yes"),
      description: t("Customer email for identification purpose."),
    },
    {
      name: "feeByCustomer",
      type: "boolean",
      mandatory: t("Yes"),
      description: t(
        'If set to "true" the payment will take the fee from the customer directly.',
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <p className="mb-2 text-base font-medium leading-[22px]">
          {t("Create Payment")}
        </p>
        <p>
          {t(
            "This operation is used to take payments directly from your customers in your account.",
          )}
        </p>
      </div>
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium leading-[22px]">
          {t("Request URL")}
        </p>
        <p>
          <code className="rounded-[4px] border border-border bg-background px-2 py-1 text-sm">
            POST {branding?.apiUrl}/mapi/payment
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
          {t("Body Parameters")}
        </p>
        <DataTable
          className="border"
          data={paymentParams}
          structure={[
            {
              id: "name",
              header: t("Name"),
              cell: ({ row }) => (
                <p className="font-normal">{row.original?.name}</p>
              ),
            },
            {
              id: "type",
              header: t("Type"),
              cell: ({ row }) => (
                <p className="font-normal">{row.original?.type}</p>
              ),
            },
            {
              id: "mandatory",
              header: t("Mandatory"),
              cell: ({ row }) => (
                <p className="font-normal">{row.original?.mandatory}</p>
              ),
            },
            {
              id: "description",
              header: t("Description"),
              cell: ({ row }) => (
                <p className="font-normal">{row.original?.description}</p>
              ),
            },
          ]}
        />
      </div>
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium leading-[22px]">
          {t("Example")} (curl)
        </p>
        <pre className="mb-2 overflow-x-auto rounded-[4px] border border-border bg-background p-4">
          <code>
            {`curl -X POST ${branding?.apiUrl}/mapi/payment \\
  -H "Authorization: Bearer API_KEY"
  -H "Content-type: application/json"
  -d '{
    "amount": 200,
    "currency": "USD",
    "amount": 100,
    "logo": "https://example.com/logo.png",
    "callbackUrl": "https://example.com/callback",
    "successUrl": "https://example.com/success",
    "cancelUrl": "https://example.com/cancel",
    "sandbox": true,
    "custom": {
      "ref": "TRX100"
    },
    "customerName": "John Doe",
    "customerEmail": "john@doe.com",
    "feeByCustomer": false
  }'`}
          </code>
        </pre>
      </div>
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium leading-[22px]">
          {t("Responses")}
        </p>
        <p className="mb-2 text-sm font-medium leading-[22px]">200 OK</p>

        <pre className="mb-2 overflow-x-auto rounded-[4px] border border-border bg-background p-4">
          <code>
            {`{
  "success": boolean,
  "message": string,
  "redirectUrl": string,
  "data": object
}
`}
          </code>
        </pre>
      </div>
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium leading-[22px]">
          {t("400 Bad Request")}
        </p>

        <pre className="mb-2 overflow-x-auto rounded-[4px] border border-border bg-background p-4">
          <code>
            {`{
  "success": boolean,
  "error": object/string
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
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium leading-[22px]">
          {t("Webhook (POST)")}
        </p>

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
        <p>{t("Redirect your customer to")} [redirectUrl]</p>
      </div>
    </div>
  );
}
