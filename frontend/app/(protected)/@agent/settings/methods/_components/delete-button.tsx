import { Button } from "@/components/ui/button";
import { deleteMethod } from "@/data/settings/methods";
import { Trash } from "iconsax-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { mutate } from "swr";

export function DeleteButton({ row }: { row: any }) {
  const { t } = useTranslation();

  const handleDelete = () => {
    toast.promise(deleteMethod(row.id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        mutate("/agent-methods");
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      type="button"
      onClick={handleDelete}
      className="size-8"
    >
      <Trash size={17} />
    </Button>
  );
}
