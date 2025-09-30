"use client";

import { Button } from "@/components/ui/button";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import cn from "@/lib/utils";
import { ArrowLeft2, Save2 } from "iconsax-react";
import * as React from "react";
import { useTranslation } from "react-i18next";

type TPageLayoutCtx = {
  width: number;
  rightSidebar: boolean;
  setRightSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const PageLayoutCtx = React.createContext<TPageLayoutCtx | null>(null);

const usePageLayout = () => {
  const context = React.useContext(PageLayoutCtx);
  if (!context)
    throw new Error(
      "usePageLayout must be used within an PageLayoutCtx. Please ensure that your component is wrapped with an PageLayoutCtx.",
    );

  return context;
};

// Right sidebar toggler
export function RightSidebarToggler({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { setRightSidebar } = usePageLayout();

  return (
    <div
      className={cn(
        "flex items-center justify-end md:mb-4 xl:hidden",
        className,
      )}
    >
      <Button
        onClick={() => setRightSidebar((prev) => !prev)}
        variant="outline"
        size="sm"
        type="button"
        className="text-sm"
      >
        <Save2 size="20" />
        {t("Bookmarks")}
      </Button>
    </div>
  );
}

// Page layout
export function PageLayout({ children }: { children: React.ReactNode }) {
  const [rightSidebar, setRightSidebar] = React.useState(false);
  const { width } = useDeviceSize();

  // Sidebar
  React.useEffect(() => {
    if (width >= 1280) {
      setRightSidebar(true);
    }
  }, [width]);

  // context value
  const contextValue = React.useMemo(
    () => ({ width, rightSidebar, setRightSidebar }),
    [width, rightSidebar],
  );

  return (
    <PageLayoutCtx.Provider value={contextValue}>
      {children}
    </PageLayoutCtx.Provider>
  );
}

// Right section
export function RightSidebar({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { width, rightSidebar, setRightSidebar } = usePageLayout();

  return (
    <div
      data-expanded={width >= 1280 || (width < 1280 && rightSidebar)}
      className="absolute inset-y-0 right-0 top-0 w-full max-w-96 translate-x-full bg-background-body p-6 transition-all duration-300 ease-in-out data-[expanded=true]:translate-x-0 xl:relative"
    >
      {/* sidebar close button */}
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => setRightSidebar(false)}
        className="mb-4 gap-[2px] bg-background text-sm hover:bg-background xl:hidden"
      >
        <ArrowLeft2 size={14} />
        {t("Hide bookmarks")}
      </Button>

      {/* children data */}
      {children}
    </div>
  );
}
