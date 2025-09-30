import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/data/admin/deleteUser";
import { useAuth } from "@/hooks/useAuth";
import { Trash } from "iconsax-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function DeleteStaffButton({
  staffId,
  onMutate,
}: {
  staffId: number | string;
  onMutate: () => void;
}) {
  const { auth } = useAuth();
  const { t } = useTranslation();
  const handleDeleteInvestment = async () => {
    const res = await deleteUser(staffId);

    if (res.status) {
      onMutate();
      toast.success(t("Staff deleted successfully"));
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          color="danger"
          disabled={auth?.id === staffId}
          className="h-8 w-8 rounded-md bg-background text-danger hover:bg-background"
        >
          <Trash size={20} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Delete Staff")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              "Are you sure you want to delete this staff? This action cannot be undone, and all associated data will be permanently removed.",
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            onClick={handleDeleteInvestment}
            className="action:bg-destructive/80 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("Continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
