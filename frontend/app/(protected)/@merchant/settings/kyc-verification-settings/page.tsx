"use client";

import { DocumentInfo } from "@/components/page-components/settings/DocumentInfo";
import KYCStatus from "@/components/page-components/settings/KYCStatus";
import { Accordion } from "@/components/ui/accordion";
import { useKeySettings } from "@/hooks/useKycSettings";

export default function KFCVerificationSettings() {
  const { data, isLoading, refresh } = useKeySettings();

  return (
    <Accordion
      type="multiple"
      defaultValue={["KYC_STATUS", "DOCUMENT_INFORMATION"]}
    >
      <div className="flex flex-col gap-4">
        <KYCStatus fetchData={data} isLoading={isLoading} />
        <DocumentInfo
          fetchData={data}
          isLoading={isLoading}
          refresh={refresh}
        />
      </div>
    </Accordion>
  );
}
