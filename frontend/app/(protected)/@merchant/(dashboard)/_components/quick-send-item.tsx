import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import Label from "@/components/ui/label";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { useTranslation } from "react-i18next";

export function QuickSendItem({
  id,
  checked = false,
  onSelect,
  name,
  avatar,
  email,
}: {
  id: string;
  name: string;
  checked?: boolean;
  onSelect: (id: string) => void;
  avatar?: string;
  email: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="inline-flex w-full items-center justify-between gap-2.5">
      <div className="inline-flex gap-2.5">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{getAvatarFallback(name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm text-foreground">{name}</p>
          <p className="text-xs">{email}</p>
        </div>
      </div>

      <div className="inline-flex items-center gap-1">
        <Checkbox
          id={id}
          className="size-4 border-foreground/40 hover:border-primary data-[state=checked]:border-primary"
          checked={!!checked}
          onCheckedChange={() => onSelect(id)}
        />
        <Label
          htmlFor={id}
          className="-mt-1 cursor-pointer p-0 text-sm font-normal leading-5 text-foreground"
        >
          {checked ? t("Added") : t("Add")}
        </Label>
      </div>
    </div>
  );
}
