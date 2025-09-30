import Image from "next/image";

interface IProps {
  name: string;
  phone: string;
  countryCode: string;
  onSelect: (value: string) => void;
}

export function SavedPhoneNumber({
  name,
  phone,
  countryCode,
  onSelect,
}: IProps) {
  return (
    <div
      onClick={() => onSelect(phone)}
      role="presentation"
      className="flex cursor-pointer items-center gap-4 border-b border-border px-4 py-1.5 hover:bg-accent"
    >
      <Image
        src={`https://flagicons.lipis.dev/flags/4x3/${countryCode?.toLowerCase()}.svg`}
        alt={name}
        width={32}
        height={24}
      />
      <div className="flex-1">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-sm opacity-70">{phone}</p>
      </div>
    </div>
  );
}
