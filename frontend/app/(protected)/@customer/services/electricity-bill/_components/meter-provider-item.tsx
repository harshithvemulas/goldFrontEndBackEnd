import { Case } from "@/components/common/Case";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarFallback } from "@/utils/getAvatarFallback";

interface IProps {
  providerName: string;
  logo: string;
  meterNumber?: string;
  meterType?: string;
}

export default function MeterProviderItem({
  providerName,
  logo,
  meterNumber,
  meterType,
}: IProps) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar className="border-2 border-border-primary">
        <AvatarImage src={logo} alt={providerName} />
        <AvatarFallback>{getAvatarFallback(providerName)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 text-foreground">
        <h6 className="text-sm font-normal">{providerName}</h6>
        <Case condition={!!meterNumber}>
          <p className="text-xs font-normal text-secondary-text">
            {meterNumber}
          </p>
        </Case>
        <Case condition={!!meterType}>
          <p className="text-xs font-normal text-secondary-text">{meterType}</p>
        </Case>
      </div>
    </div>
  );
}
