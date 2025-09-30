// eslint-disable-next-line max-classes-per-file
class TransactionDetails {
  id: number;
  trxId: string;
  type: string;
  from: string;
  to: string;
  amount: number;
  fee: number;
  total: number;
  status: string;
  method: string;
  isBookmarked: number;
  metaData: string;
  userId: number;
  createdAt: string;
  updatedAt: string;

  constructor(data: any = {}) {
    this.id = data.id || 0;
    this.trxId = data.trxId || "";
    this.type = data.type || "";
    this.from = data.from || "";
    this.to = data.to || "";
    this.amount = data.amount || 0;
    this.fee = data.fee || 0;
    this.total = data.total || 0;
    this.status = data.status || "";
    this.method = data.method || "";
    this.isBookmarked = data.isBookmarked || 0;
    this.metaData = data.metaData || "";
    this.userId = data.userId || 0;
    this.createdAt = data.createdAt || "";
    this.updatedAt = data.updatedAt || "";
  }
}

class Agent {
  id: number;
  userId: number;
  addressId: number;
  agentId: string;
  name: string;
  email: string;
  occupation: string;
  whatsapp: string | null;
  status: string;
  isRecommended: number;
  isSuspend: number;
  proof: string;
  depositFee: number;
  withdrawalFee: number;
  depositCommission: number;
  withdrawalCommission: number;
  agreeFundingCustomer: number;
  agreeHonest: number;
  agreeRechargeCustomer: number;
  createdAt: string;
  updatedAt: string;
  user: User;

  constructor(data: any = {}) {
    this.id = data.id || 0;
    this.userId = data.userId || 0;
    this.addressId = data.addressId || 0;
    this.agentId = data.agentId || "";
    this.name = data.name || "";
    this.email = data.email || "";
    this.occupation = data.occupation || "";
    this.whatsapp = data.whatsapp || null;
    this.status = data.status || "";
    this.isRecommended = data.isRecommended || 0;
    this.isSuspend = data.isSuspend || 0;
    this.proof = data.proof || "";
    this.depositFee = data.depositFee || 0;
    this.withdrawalFee = data.withdrawalFee || 0;
    this.depositCommission = data.depositCommission || 0;
    this.withdrawalCommission = data.withdrawalCommission || 0;
    this.agreeFundingCustomer = data.agreeFundingCustomer || 0;
    this.agreeHonest = data.agreeHonest || 0;
    this.agreeRechargeCustomer = data.agreeRechargeCustomer || 0;
    this.createdAt = data.createdAt || "";
    this.updatedAt = data.updatedAt || "";
    this.user = data.user ? new User(data.user) : new User();
  }
}

class User {
  id: number;
  roleId: number;
  email: string;
  isEmailVerified: number;
  status: number;
  kycStatus: number;
  lastIpAddress: string;
  lastCountryName: string;
  passwordUpdated: number;
  referralCode: string;
  referredBy: string | null;
  otpCode: string | null;
  acceptTermsCondition: number;
  limitTransfer: number;
  dailyTransferLimit: number | null;
  createdAt: string;
  updatedAt: string;
  customer: Customer;

  constructor(data: any = {}) {
    this.id = data.id || 0;
    this.roleId = data.roleId || 0;
    this.email = data.email || "";
    this.isEmailVerified = data.isEmailVerified || 0;
    this.status = data.status || 0;
    this.kycStatus = data.kycStatus || 0;
    this.lastIpAddress = data.lastIpAddress || "";
    this.lastCountryName = data.lastCountryName || "";
    this.passwordUpdated = data.passwordUpdated || 0;
    this.referralCode = data.referralCode || "";
    this.referredBy = data.referredBy || null;
    this.otpCode = data.otpCode || null;
    this.acceptTermsCondition = data.acceptTermsCondition || 0;
    this.limitTransfer = data.limitTransfer || 0;
    this.dailyTransferLimit = data.dailyTransferLimit || null;
    this.createdAt = data.createdAt || "";
    this.updatedAt = data.updatedAt || "";
    this.customer = data?.customer
      ? new Customer(data.customer)
      : new Customer();
  }
}

class Customer {
  id: number;
  userId: number;
  addressId: number;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  phone: string;
  gender: string;
  dob: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: any = {}) {
    this.id = data.id || 0;
    this.userId = data.userId || 0;
    this.addressId = data.addressId || 0;
    this.firstName = data.firstName || "";
    this.lastName = data.lastName || "";
    this.profileImage = data.profileImage || null;
    this.phone = data.phone || "";
    this.gender = data.gender || "";
    this.dob = data.dob || "";
    this.createdAt = data.createdAt || "";
    this.updatedAt = data.updatedAt || "";
  }
}

// Settlement
export class Settlement {
  id: number;
  agentId: number;
  transactionId: number;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  transaction: TransactionDetails;
  agent: Agent;

  constructor(data: any = {}) {
    this.id = data.id || 0;
    this.agentId = data.agentId || 0;
    this.transactionId = data.transactionId || 0;
    this.amount = data.amount || 0;
    this.currency = data.currency || "";
    this.status = data.status || "";
    this.createdAt = data.createdAt || "";
    this.updatedAt = data.updatedAt || "";
    this.transaction = data.transaction
      ? new TransactionDetails(data.transaction)
      : new TransactionDetails();
    this.agent = data.agent ? new Agent(data.agent) : new Agent();
  }
}
