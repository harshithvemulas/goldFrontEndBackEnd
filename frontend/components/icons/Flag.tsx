import cn from "@/lib/utils";
import Image from "next/image";

export function Flag({
  countryCode,
  className,
  url,
}: {
  countryCode?: string;
  className?: string;
  url?: string;
}) {
  if (!countryCode && !url) return null;
  return (
    <Image
      src={url ?? `https://flagcdn.com/${countryCode?.toLowerCase()}.svg`}
      alt={countryCode as string}
      width={20}
      height={16}
      loading="lazy"
      className={cn("rounded-[2px]", className)}
    />
  );
}
