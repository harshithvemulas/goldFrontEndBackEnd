import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import cn from "@/lib/utils";
import { TickCircle } from "iconsax-react";
import React from "react";
import Separator from "../ui/separator";

interface IStepsContentProps extends React.ComponentProps<typeof TabsContent> {
  children: React.ReactNode;
}
type TTab = {
  value: string;
  title: string;
  complete: boolean;
  isVisible?: boolean;
};

export function Steps({
  value = "",
  tabs = [],
  children,
  onTabChange,
}: {
  value?: string;
  tabs: TTab[];
  children: React.ReactNode | React.ReactNode[];
  onTabChange: (tab: string) => void;
}) {
  const [progress, setProgress] = React.useState(0);

  const visibleTabs = tabs.filter(
    (t) => t.isVisible === undefined || t.isVisible === true,
  );

  const activeTabIndex = visibleTabs.findIndex((tab) => tab.value === value);
  const size = visibleTabs.length;

  React.useEffect(() => {
    const p = ((activeTabIndex + 1) / size) * 100;
    setProgress(p);
  }, [activeTabIndex, size, value]);

  return (
    <Tabs value={value} onValueChange={onTabChange}>
      <div className="hidden h-0.5 w-full bg-background-body md:flex">
        <Separator
          className={cn(`h-0.5 bg-primary transition-[width] duration-200`)}
          style={{ width: `${progress}%` }}
        />
      </div>
      <TabsList className="hidden bg-transparent md:flex">
        {visibleTabs.map((tab, index) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={index > activeTabIndex}
            data-complete={tab.complete}
            className="ring-none group h-8 justify-start rounded-lg border-none border-border px-3 text-sm font-normal leading-5 text-foreground shadow-none outline-none transition-all duration-200 hover:bg-accent hover:text-primary data-[state=active]:bg-transparent data-[complete=true]:text-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:hover:bg-accent"
          >
            <TickCircle
              size={19}
              className="mr-2 group-hover:text-primary"
              variant={tab.complete ? "Bold" : "Linear"}
            />
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {children}
    </Tabs>
  );
}

export function StepsContent({ children, ...props }: IStepsContentProps) {
  return <TabsContent {...props}>{children}</TabsContent>;
}
