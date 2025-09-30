"use client";

import { Button } from "@/components/ui/button";
import { deleteContact } from "@/data/customers/contacts/deleteContact";
import { Trash } from "iconsax-react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

export default function ContactTableMenu({ row }: { row: any }) {
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();
  const searchParams = useSearchParams();

  const handleDeleteContact = (id: number | string) => {
    toast.promise(deleteContact(String(id)), {
      loading: t("Deleting..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);

        mutate(
          `/contacts?page=${searchParams.get("page") ?? 1}&limit=${searchParams.get("limit") ?? 10}`,
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
        onClick={() => handleDeleteContact(row.id)}
        size="sm"
        className="h-8 w-8 bg-[#D13438] hover:bg-[#c1262b]"
      >
        <Trash size="20" color="#fff" />
      </Button>
    </div>
  );
}
