"use client";

import { Button } from "@/components/ui/button";
import { deleteFavorite } from "@/data/favorites/deleteFavorite";
import { Trash } from "iconsax-react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

export function Menu({ row }: { row: any }) {
  const { mutate } = useSWRConfig();
  const searchParams = useSearchParams();

  const { t } = useTranslation();

  // bookmark
  const handleRemoveFavorite = (id: number) => {
    toast.promise(deleteFavorite(id.toString()), {
      loading: t("Processing..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);

        mutate(
          `/saves?page=${searchParams.get("page") ?? 1}&limit=${searchParams.get("limit") ?? 10}`,
        );
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => handleRemoveFavorite(row?.id)}
        size="icon"
        className="h-8 w-8 bg-[#D13438] hover:bg-[#c1262b]"
      >
        <Trash size="20" color="#fff" />
      </Button>
    </div>
  );
}
