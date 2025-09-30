import { Address } from "@/types/address";
import { User } from "@/types/user";

export class Merchant {
  id: number;
  userId: number;
  addressId: number;
  merchantId: string;
  storeProfileImage: string | null;
  name: string;
  email: string;
  status: string;
  isSuspend: number;
  proof: string;
  depositFee: number;
  withdrawFee: number;
  apiKey: string | null;
  allowedIp: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  address: Address;

  constructor(data?: any) {
    this.id = data?.id;
    this.userId = data?.userId;
    this.addressId = data?.addressId;
    this.merchantId = data?.merchantId;
    this.storeProfileImage = data?.storeProfileImage ?? null;
    this.name = data?.name;
    this.email = data?.email;
    this.status = data?.status ?? "pending";
    this.isSuspend = data?.isSuspend ?? 0;
    this.proof = data?.proof;
    this.depositFee = data?.depositFee ?? 0;
    this.withdrawFee = data?.withdrawFee ?? 0;
    this.apiKey = data?.apiKey ?? null;
    this.allowedIp = data?.allowedIp ?? null;
    this.createdAt = new Date(data?.createdAt);
    this.updatedAt = new Date(data?.updatedAt);
    this.user = new User(data?.user);
    this.address = new Address(data?.address);
  }

  // Example method to activate the merchant
  activateMerchant() {
    this.status = "active";
  }

  // Example method to suspend the merchant
  suspendMerchant() {
    this.isSuspend = 1;
  }

  // Example method to update API key
  updateApiKey(newApiKey: string) {
    this.apiKey = newApiKey;
  }
}
