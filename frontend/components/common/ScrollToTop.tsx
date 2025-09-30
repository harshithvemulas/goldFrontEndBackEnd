"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "scrollRestoration" in window.history
    ) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
