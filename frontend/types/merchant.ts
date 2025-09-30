export class Merchant {
  id: number;
  userId: number;
  merchantId: string;
  name: string;
  email: string;
  status: string;
  isSuspend: number;
  proof: string;
  depositFee: string;
  withdrawFee: string;
  webhookUrl: string | null;
  allowedIp: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(merchant: any) {
    this.id = merchant?.id;
    this.userId = merchant?.userId;
    this.merchantId = merchant?.merchantId;
    this.name = merchant?.name;
    this.email = merchant?.email;
    this.status = merchant?.status;
    this.isSuspend = merchant?.isSuspend;
    this.proof = merchant?.proof;
    this.depositFee = merchant?.depositFee;
    this.withdrawFee = merchant?.withdrawFee;
    this.webhookUrl = merchant?.webhookUrl;
    this.allowedIp = merchant?.allowedIp;
    this.createdAt = new Date(merchant?.createdAt);
    this.updatedAt = new Date(merchant?.updatedAt);
  }
}
