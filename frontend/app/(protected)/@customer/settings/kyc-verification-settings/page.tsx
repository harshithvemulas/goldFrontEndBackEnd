"use client";

import { DocumentInfo } from "@/components/page-components/settings/DocumentInfo";
import KYCStatus from "@/components/page-components/settings/KYCStatus";
import { Accordion } from "@/components/ui/accordion";
import axios from "@/lib/axios";
import useSWR from "swr";

export default function KFCVerificationSettings() {
  const { data, isLoading, mutate } = useSWR(
    "/kycs/detail",
    (url) => axios.get(url),
    {
      refreshInterval: 0,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      refreshWhenHidden: false,
      shouldRetryOnError: false,
    },
  );

  return (
    <Accordion
      type="multiple"
      defaultValue={["KYC_STATUS", "DOCUMENT_INFORMATION"]}
    >
      <div className="flex flex-col gap-4">
        <KYCStatus fetchData={data?.data} isLoading={isLoading} />
        <DocumentInfo fetchData={data} isLoading={isLoading} refresh={mutate} />
      </div>
    </Accordion>
  );
}
