"use client";

/* eslint-disable no-nested-ternary */
import GlobalLoader from "@/components/common/GlobalLoader";
import { agentDevice, DeviceType } from "@/data/agentDevice";
import { useSWR } from "@/hooks/useSWR";
import axios from "@/lib/axios";
import { UNAUTHORIZED_ROUTES } from "@/lib/configs";
import { User } from "@/types/auth";
import { GeoLocation } from "@/types/geo-location";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

type TReferral = {
  applyOn: string;
  bonusAmount: string;
  bonusReceiver: string;
};

type TBranding = {
  siteName: string;
  siteUrl: string;
  apiUrl: string;
  cardBg: string | undefined;
  authBanner: string | undefined;
  defaultCurrency: string;
  defaultLanguage: string;
  logo: string | undefined;
  favicon: string | undefined;
  customerRegistration: boolean;
  agentRegistration: boolean;
  merchantRegistration: boolean;
  referral: TReferral;
};

// context value type
type GlobalProviderProps = {
  isAuthenticate: boolean;
  auth: User | null;
  isLoading: boolean;
  refreshAuth: () => void;
  deviceLocation?: GeoLocation;

  isExpanded: boolean;
  device: DeviceType;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;

  branding: TBranding;

  googleAnalytics: {
    active: boolean;
    apiKey: string;
  };
};

// initial context value
const initialData = {
  isAuthenticate: false,
  auth: null,
  isLoading: true,
  refreshAuth: () => {},
  deviceLocation: undefined,

  isExpanded: false,
  device: "Desktop" as DeviceType,
  setIsExpanded: () => {},

  branding: {
    siteName: "",
    siteUrl: "",
    apiUrl: "",
    defaultCurrency: "",
    defaultLanguage: "",
    logo: undefined,
    favicon: undefined,
    authBanner: undefined,
    cardBg: undefined,
    customerRegistration: false,
    agentRegistration: false,
    merchantRegistration: false,
    referral: {
      applyOn: "",
      bonusAmount: "",
      bonusReceiver: "",
    },
  },

  googleAnalytics: {
    active: false,
    apiKey: "",
  },
};

const GlobalContext = React.createContext<GlobalProviderProps>(initialData);

export const useGlobal = () => React.useContext(GlobalContext);

export default function GlobalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [device, setDevice] = React.useState<DeviceType>("Desktop");
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [deviceLocation, setDeviceLocation] = React.useState<GeoLocation>();
  const { data, isLoading, error, mutate } = useSWR("/auth/check", {
    revalidateOnFocus: false,
  });
  const { data: branding, isLoading: brandingLoading } = useSWR(
    "/settings/global/branding",
    {
      revalidateOnFocus: false,
    },
  );
  const { data: gaData, isLoading: gaLoading } = useSWR(
    "/external-plugins/google-analytics",
    {
      revalidateOnFocus: false,
    },
  );
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    (async () => {
      const res = await agentDevice();
      setDevice(res.deviceType);
    })();
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      // Update device type
      const newDevice =
        width < 768 ? "Mobile" : width < 1024 ? "Tablet" : "Desktop";
      setDevice(newDevice);

      // Update sidebar expansion
      setIsExpanded(width > 1024);
    };

    // Initial call to set values immediately
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useLayoutEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post("/auth/geo-location");
        setDeviceLocation(new GeoLocation(data));
      } catch {
        /* empty */
      }
    })();
  }, []);

  React.useLayoutEffect(() => {
    if (error && !UNAUTHORIZED_ROUTES.includes(pathname)) {
      router.push("/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const value = React.useMemo(
    () => ({
      isAuthenticate: Boolean(data?.data?.login),
      auth: data?.data?.user ? new User(data?.data?.user) : null,
      isLoading,
      deviceLocation,
      refreshAuth: () => mutate(data),
      isExpanded,
      device,
      setIsExpanded,
      branding: branding?.data,
      googleAnalytics: gaData?.data
        ? {
            active: gaData?.data.active,
            apiKey: gaData?.data.apiKey,
          }
        : {
            active: false,
            apiKey: "",
          },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, deviceLocation, isExpanded, device],
  );

  const allDataLoaded = !isLoading && !brandingLoading && !gaLoading;

  return (
    <GlobalContext.Provider value={value}>
      {allDataLoaded ? children : <GlobalLoader />}
    </GlobalContext.Provider>
  );
}
