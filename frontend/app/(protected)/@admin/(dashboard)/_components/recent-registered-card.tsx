"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import cn, { imageURL } from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { useTranslation } from "react-i18next";

interface IProps {
  image: string;
  name: string;
  email: string;
  userId: string;
  className?: string;
  isActive: boolean;
}

export function RecentRegisteredCard({
  image,
  name,
  email,
  userId,
  className,
  isActive,
}: IProps) {
  const { t } = useTranslation();

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Avatar className="size-8">
        <AvatarImage src={imageURL(image)} alt={name} />
        <AvatarFallback>{getAvatarFallback(name)}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <h6 className="text-xs font-normal leading-4">{name}</h6>
        <p className="text-xs font-normal leading-4 text-secondary-text">
          {email}
        </p>
        <p className="text-xs font-normal leading-4 text-secondary-text">
          #{userId}
        </p>
      </div>

      <Badge variant={isActive ? "success" : "secondary"}>
        {isActive ? t("Active") : t("Inactive")}
      </Badge>
    </div>
  );
}
