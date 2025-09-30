"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Separator from "@/components/ui/separator";
import { useApp } from "@/hooks/useApp";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { ArrowRight2 } from "iconsax-react";
import React from "react";

interface IProps {
  avatar?: string;
  name: string;
  email?: string;
  wallet?: string;
  onCallback?: () => void;
  callbackBtnLabel?: string;
}

export function SavedItem({
  avatar,
  name,
  email,
  wallet,
  onCallback,
  callbackBtnLabel,
}: IProps) {
  const [open, setOpen] = React.useState(false);
  const { device } = useApp();

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg px-4 py-2 hover:cursor-pointer hover:bg-accent"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{getAvatarFallback(name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm text-foreground">{name}</p>
          <p className="text-xs text-secondary-text">{email}</p>
        </div>
        {wallet ? <Badge variant="secondary">{wallet}</Badge> : null}
      </HoverCardTrigger>

      {/* hover content */}
      <HoverCardContent
        align={device === "Desktop" ? "start" : "end"}
        side={device === "Desktop" ? "left" : "bottom"}
        sideOffset={10}
        className="rounded-lg border-none px-0 py-2"
      >
        <div className="flex flex-col items-center p-1">
          <Avatar className="mb-3 h-14 w-14">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{getAvatarFallback(name)}</AvatarFallback>
          </Avatar>
          <h5 className="m-0 p-0 text-base font-medium leading-[22px] text-foreground">
            {name}
          </h5>
          <p className="p-0 text-sm font-normal leading-5 text-secondary-text">
            {email}
          </p>
          <Separator className="mb-2.5 mt-[11px]" />
          <Button
            type="button"
            onClick={onCallback}
            className="mx-auto h-10 w-[228px] rounded-lg px-4 py-2 text-base font-medium leading-[22px]"
          >
            {callbackBtnLabel}
            <ArrowRight2 size={16} />
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
