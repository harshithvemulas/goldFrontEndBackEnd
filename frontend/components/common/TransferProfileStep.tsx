import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import cn from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { TickCircle } from "iconsax-react";

export function TransferProfileStep({
  senderName,
  senderAvatar,
  senderInfo,
  receiverName,
  receiverAvatar,
  receiverInfo,
  className,
}: {
  senderName: string;
  senderAvatar?: string;
  senderInfo?: (string | null | undefined)[];
  receiverName: string;
  receiverAvatar?: string;
  receiverInfo?: (string | null | undefined)[];
  className?: string;
}) {
  return (
    <div
      className={cn("mb-4 flex items-start justify-around gap-1", className)}
    >
      <ProfileItem name={senderName} avatar={senderAvatar} info={senderInfo} />
      {receiverName && (
        <>
          <div className="mt-8 h-[1px] flex-1 border-t border-dashed border-success sm:mt-10" />
          <ProfileItem
            name={receiverName}
            avatar={receiverAvatar}
            info={receiverInfo}
          />
        </>
      )}
    </div>
  );
}

// Profile item
function ProfileItem({
  avatar,
  name,
  info = [],
}: {
  avatar?: string;
  name: string;
  info?: (string | null | undefined)[];
}) {
  // Filter out falsy values (null, undefined, empty strings)
  const filteredInfo = info.filter(Boolean) as string[];

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="relative mb-4 size-10 sm:size-14 md:mb-0">
        {/* Avatar */}
        <Avatar className="size-10 rounded-full sm:size-14">
          <AvatarImage src={avatar} alt={name} width={56} height={56} />
          <AvatarFallback className="font-semibold">
            {getAvatarFallback(name)}
          </AvatarFallback>
        </Avatar>
        {/* Tick */}
        <span className="absolute bottom-0 right-0 rounded-full bg-background p-[1px]">
          <TickCircle
            color="#13A10E"
            variant="Bold"
            className="size-4 sm:size-5"
          />
        </span>
      </div>
      <div>
        <p className="block w-full max-w-[100px] whitespace-nowrap text-sm font-medium leading-[4px] sm:max-w-[150px] sm:text-base">
          {name}
        </p>
        {filteredInfo.length > 0 &&
          filteredInfo.map((s, index) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="line-clamp-2 block max-w-[100px] text-xs font-normal leading-5 text-secondary-text sm:max-w-[150px] sm:text-sm"
            >
              {s}
            </span>
          ))}
      </div>
    </div>
  );
}
