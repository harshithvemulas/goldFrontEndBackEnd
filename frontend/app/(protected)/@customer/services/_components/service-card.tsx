import { Button } from "@/components/ui/button";
import cn from "@/lib/utils";
import { ArrowRight } from "iconsax-react";
import Link from "next/link";

export function ServiceCard({
  serviceName,
  description,
  href = "/",
  icon,
  disabled = false,
}: {
  serviceName: string;
  description?: string;
  href: string;
  icon: React.ReactElement;
  disabled?: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`w-full md:w-auto ${disabled ? "pointer-events-none" : "group"}`}
    >
      <div
        className={cn(
          "group relative flex h-full w-full flex-col items-center justify-between rounded-lg bg-background px-6 py-4 opacity-100 shadow-defaultLite md:w-[300px]",
          disabled ? "cursor-not-allowed" : "hover:shadow-light-8",
        )}
      >
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            className="invisible absolute right-2.5 top-2.5 group-hover:visible"
          >
            <ArrowRight size={20} />
          </Button>
          {icon}
          <h5
            className={cn(
              "mb-2 mt-4 text-center font-normal",
              disabled && "text-secondary-text",
            )}
          >
            {serviceName}
          </h5>
          <p className="mb-4 text-center text-xs text-secondary-text">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
