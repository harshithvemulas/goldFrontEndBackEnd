import { useAuth } from "@/hooks/useAuth";
import { useSWR } from "@/hooks/useSWR";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

function TawkChat() {
  const { data: tawkData, isLoading: tawkLoading } = useSWR(
    "/external-plugins/tawk-to",
    {
      revalidateOnFocus: false,
    },
  );
  const { auth, isLoading } = useAuth();
  if (tawkLoading || isLoading) return null;
  if (!tawkData?.data?.active) return null;
  if (auth?.role?.name === "Admin") return null;
  return (
    <TawkMessengerReact
      propertyId={tawkData?.data?.secretKey}
      widgetId={tawkData?.data?.apiKey}
    />
  );
}

export default TawkChat;
