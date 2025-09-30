import { useGlobal } from "@/contexts/GlobalProvider";

export const useAuth = () => {
  const global = useGlobal();
  return {
    isAuthenticate: global.isAuthenticate,
    auth: global.auth,
    isLoading: global.isLoading,
    refreshAuth: global.refreshAuth,
    deviceLocation: global.deviceLocation,
  };
};
