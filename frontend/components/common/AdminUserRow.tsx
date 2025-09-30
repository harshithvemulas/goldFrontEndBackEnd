import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import Link from "next/link";

function AdminUserRow({ row }: any) {
  const generateLink = () => {
    switch (row.original?.user?.roleId) {
      case 1:
        return `/staffs/edit/${row.original?.user?.id}`;
      case 2:
        return `/customers/${row.original?.user?.customer?.id}?name=${row.original?.user?.customer?.name}&active=${row?.original?.user?.status}`;
      case 3:
        return `/merchants/${row.original?.userId}/${row.original?.user?.merchant?.id}?name=${row.original.user?.customer?.name}&active=${row?.original?.user?.status}`;
      case 4:
        return `/agents/${row.original?.userId}/${row.original?.user?.agent?.id}?name=${row.original.user?.customer?.name}&active=${row?.original?.user?.status}`;
      default:
        return `/customers/${row.original?.user?.customer?.id}?name=${row.original?.user?.customer?.name}&active=${row?.original?.user?.status}`;
    }
  };
  return (
    <Link
      href={generateLink()}
      className="flex min-w-[80px] items-center gap-2 font-normal text-secondary-text hover:text-foreground"
    >
      <Avatar>
        <AvatarImage src={row.original.user.customer.profileImage} />
        <AvatarFallback>
          {getAvatarFallback(row.original.user.customer.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <p className="text-sm font-normal">{row.original.user.customer.name}</p>
        {row.original?.user.email ? (
          <p className="text-xs font-normal">{row.original?.user.email}</p>
        ) : null}
      </div>
    </Link>
  );
}

export default AdminUserRow;
