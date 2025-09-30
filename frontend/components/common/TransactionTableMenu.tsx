"use client";

import { Button } from "@/components/ui/button";
import { toggleBookmark } from "@/data/transaction-history/toggleBookmark";
import { Heart, HeartSlash } from "iconsax-react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

export default function TransactionTableMenu({ row }: { row: any }) {
  const { mutate } = useSWRConfig();
  const searchParams = useSearchParams();

  const { t } = useTranslation();

  // bookmark
  const handleBookMark = (id: number) => {
    toast.promise(toggleBookmark(id.toString()), {
      loading: t("Processing..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);

        mutate(
          `/transactions?page=${searchParams.get("page") ?? 1}&limit=${searchParams.get("limit") ?? 10}`,
        );
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleBookMark(row.id)}
      >
        {row?.isBookmarked ? (
          <Heart size="20" variant="Bold" color="#D13438" />
        ) : (
          <HeartSlash size="20" color="#D13438" />
        )}
      </Button>
    </div>
  );
}
