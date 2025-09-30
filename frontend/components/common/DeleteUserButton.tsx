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
import { Trash } from "iconsax-react";
import React from "react";
import { useTranslation } from "react-i18next";

export function DeleteUserButton({
  children,
  onConfirm,
}: {
  children?: React.ReactNode;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children || (
          <Button
            type="button"
            aria-label="deleteUser"
            variant="ghost"
            size="icon"
            className="hover:bg-destructive/5 hover:text-destructive active:bg-destructive/50"
          >
            <Trash />
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("Delete Customer Confirmation")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              "Are you sure you want to delete this customer? This action cannot be undone, and all associated data will be permanently removed.",
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            onClick={onConfirm}
            className="action:bg-destructive/80 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("Continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
