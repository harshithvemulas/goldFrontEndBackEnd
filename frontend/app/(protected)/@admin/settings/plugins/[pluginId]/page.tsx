"use client";

import { PluginDetailsForm } from "@/app/(protected)/@admin/settings/plugins/[pluginId]/_components/plugin-details-form";
import { Loader } from "@/components/common/Loader";
import axios from "@/lib/axios";
import { useParams } from "next/navigation";
import useSWR from "swr";

export const runtime = "edge";

export default function GatewayDetails() {
  const params = useParams(); // get pluginId from params

  // fetch plugin by id
  const { data, isLoading, mutate } = useSWR(
    `/admin/external-plugins/${params.pluginId}`,
    (u: string) => axios(u),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const plugin = data?.data;

  return <PluginDetailsForm plugin={plugin} onMutate={mutate} />;
}
