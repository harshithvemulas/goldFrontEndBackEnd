import { useSWR } from "@/hooks/useSWR";
import { GoogleAnalytics } from "@next/third-parties/google";

function GoogleAnalytics4() {
  const { data: gaData, isLoading: gaLoading } = useSWR(
    "/external-plugins/google-analytics",
    {
      revalidateOnFocus: false,
    },
  );
  if (gaLoading) return null;
  if (!gaData?.data?.active) return null;
  return <GoogleAnalytics gaId={gaData?.data?.apiKey} />;
}

export default GoogleAnalytics4;
