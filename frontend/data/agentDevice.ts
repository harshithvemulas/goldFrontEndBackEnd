"use server";

import { headers } from "next/headers";

export type DeviceType = "Mobile" | "Tablet" | "Desktop";

export const agentDevice = async () => {
  const userAgent = headers().get("user-agent") || "";

  const isMobile =
    /mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(
      userAgent,
    );
  const isTablet = /ipad|tablet|playbook|silk/i.test(userAgent);

  let deviceType: DeviceType;
  if (isMobile) {
    deviceType = "Mobile";
  } else if (isTablet) {
    deviceType = "Tablet";
  } else {
    deviceType = "Desktop";
  }

  return {
    userAgent,
    deviceType,
  };
};
