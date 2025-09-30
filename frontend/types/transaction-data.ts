import { User } from "@/types/user";
import { format } from "date-fns";
import { Customer } from "@/types/customer";

export class TransactionData {
  id: number;
  trxId: string;
  type: string;
  from: {
    label: string;
    email?: string;
    image?: string;
    phone?: string;
    [key: string]: string | number | undefined;
  };
  to: {
    label: string;
    email?: string;
    image?: string;
    phone?: string;
    [key: string]: string | number | undefined;
  };
  amount: number = 0;
  fee: number = 0;
  total: number = 0;
  status: string;
  currency: string;
  method: string | null = null;
  isBookmarked: boolean = false;
  metaData: {
    currency: string;
    trxAction?: string;
    [key: string]: any;
  };
  metaDataParsed: any;
  userId: number = 3;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  user: User & { customer: Customer | null };

  constructor(data: any) {
    this.id = data?.id;
    this.trxId = data.trxId;
    this.type = data?.type;
    this.from = data?.from ? JSON.parse(data.from) : null;
    this.to = data?.to ? JSON.parse(data.to) : null;
    this.amount = data?.amount;
    this.fee = data?.fee;
    this.total = data?.total;
    this.status = data?.status;
    this.method = data?.method;
    this.currency = data?.currency;
    this.isBookmarked = Boolean(data?.isBookmarked);
    this.metaData = data?.metaData ? JSON.parse(data.metaData) : null;
    this.userId = data?.userId;
    this.createdAt = data?.createdAt ? new Date(data.createdAt) : undefined;
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : undefined;
    this.user = {
      ...new User(data?.user),
      customer: data?.user?.customer
        ? new Customer(data?.user?.customer)
        : null,
      merchant: data?.user?.merchant
        ? new Customer(data?.user?.merchant)
        : null,
      agent: data?.user?.agent ? new Customer(data?.user?.agent) : null,
    };
  }

  getCreatedAt(formatStr: string | undefined = "dd MMM yyyy") {
    if (!this.createdAt) {
      return "N/A"; // Return a default value when `createdAt` is undefined
    }
    return format(this.createdAt, formatStr);
  }

  getUpdatedAt(formatStr: string | undefined = "dd MMM yyyy") {
    if (!this.updatedAt) {
      return "N/A"; // Return a default value when `updatedAt` is undefined
    }
    return format(this.updatedAt, formatStr);
  }
}
