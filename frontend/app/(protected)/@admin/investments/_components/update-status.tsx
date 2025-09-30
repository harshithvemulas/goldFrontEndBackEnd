import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateInvestment } from "@/data/investments/updateInvestment";
import { startCase } from "@/lib/utils";
import { ArrowDown2 } from "iconsax-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function UpdateStatus({
  investmentId,
  status,
  onMutate,
}: {
  investmentId: number | string;
  status: string;
  onMutate: () => void;
}) {
  const { t } = useTranslation();
  const updateStatus = async (status: string) => {
    const res = await updateInvestment(investmentId, { status });

    if (res.status) {
      toast.success(t("Investment status updated successfully"));
      onMutate();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="flex items-center bg-success hover:bg-success/[80%]"
        >
          {startCase(status)}
          <ArrowDown2 size="20" className="text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {["active", "completed", "withdrawn", "on_hold"].map((status) => (
          <DropdownMenuItem
            key={status}
            onSelect={() => updateStatus(status)}
            className="my-0 data-[highlighted]:bg-secondary data-[highlighted]:text-secondary-foreground"
          >
            {startCase(t(status))}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
