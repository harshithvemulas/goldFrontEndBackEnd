export class Agent {
  id: number;
  userId: number;
  agentId: string;
  name: string;
  email: string;
  occupation: string;
  status: string;
  isRecommended: boolean;
  isSuspend: boolean;
  proof: string;
  depositFee: string;
  withdrawFee: string;
  withdrawCommission: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data?.id;
    this.userId = data?.userId;
    this.agentId = data?.agentId;
    this.name = data?.name;
    this.email = data?.email;
    this.occupation = data?.occupation;
    this.status = data?.status;
    this.isRecommended = Boolean(data?.isRecommended);
    this.isSuspend = Boolean(data?.isSuspend);
    this.proof = data?.proof;
    this.depositFee = data?.depositFee;
    this.withdrawFee = data?.withdrawFee;
    this.withdrawCommission = data?.withdrawCommission;
    this.createdAt = new Date(data?.createdAt);
    this.updatedAt = new Date(data?.updatedAt);
  }
}
