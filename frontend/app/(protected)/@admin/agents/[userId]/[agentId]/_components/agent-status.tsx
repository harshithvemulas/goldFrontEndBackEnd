"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Switch from "@/components/ui/switch";
import { updateAgentAccess } from "@/data/admin/updateAgentAccess";
import { updateAgentStatus } from "@/data/admin/updateAgentStatus";
import { CloseCircle, TickCircle } from "iconsax-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function AgentStatus({
  id,
  agentId,
  status,
  suspended,
  recommended,
  onMutate,
}: {
  id: string | number;
  agentId: string | number;
  status: string;
  suspended: boolean;
  recommended: boolean;
  onMutate: () => void;
}) {
  const { t } = useTranslation();

  // toggle recommendation status
  const handleUpdateStatus = ({
    isSuspend = suspended,
    isRecommended = recommended,
  }: {
    isSuspend?: boolean;
    isRecommended?: boolean;
  }) => {
    const data = {
      isSuspend,
      isRecommended,
    };

    toast.promise(updateAgentStatus(id, data), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        onMutate();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  // update access status
  const toggleAccessStatus = (type: "accept" | "decline") => {
    toast.promise(updateAgentAccess(agentId, type), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        onMutate();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    <AccordionItem
      value="AgentStatus"
      className="rounded-xl border border-border bg-background px-4 py-0"
    >
      <AccordionTrigger className="py-6 hover:no-underline">
        <p className="text-base font-medium leading-[22px]">
          {t("Agent status")}
        </p>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-6 border-t pt-4">
        <div className="inline-flex items-center gap-2">
          <h6 className="w-[150px]">{t("Suspended")}</h6>
          <Switch
            defaultChecked={suspended}
            onCheckedChange={() =>
              handleUpdateStatus({ isSuspend: !suspended })
            }
          />
        </div>
        <div className="inline-flex items-center gap-2">
          <h6 className="w-[150px]">{t("Recommended")}</h6>
          <Switch
            defaultChecked={recommended}
            onCheckedChange={() =>
              handleUpdateStatus({ isRecommended: !recommended })
            }
          />
        </div>

        {status === "pending" ? (
          <div className="flex flex-col gap-2.5">
            <h5 className="text-base font-medium">{t("Suspended")}</h5>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                onClick={() => toggleAccessStatus("accept")}
                className="bg-[#0B6A0B] text-white hover:bg-[#149014]"
              >
                <TickCircle />
                {t("Grant Access")}
              </Button>

              <Button
                type="button"
                onClick={() => toggleAccessStatus("decline")}
                className="bg-[#D13438] text-white hover:bg-[#b42328]"
              >
                <CloseCircle />
                {t("Reject")}
              </Button>
            </div>
          </div>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}
