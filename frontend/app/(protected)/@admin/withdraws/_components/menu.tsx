"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, More } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function MenuButton() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-md bg-background text-primary hover:bg-background hover:text-primary"
        >
          <More size={20} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="m-0 min-w-[153px] py-0" align="end">
        <DropdownMenuItem onSelect={() => router.push("/withdraws/234232")}>
          <span className="inline-flex items-center gap-1 text-sm">
            <Eye size={16} />
            {t("View")}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
