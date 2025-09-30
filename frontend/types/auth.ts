import { Agent } from "@/types/agent";
import { Customer } from "@/types/customer";
import { Merchant } from "@/types/merchant";
import { Role } from "@/types/role";
import { configs } from "@/lib/configs";

type Permission = {
  id: number;
  userId: number;
  deposit: number;
  withdraw: number;
  payment: number;
  exchange: number;
  transfer: number;
  addAccount: number;
  addRemoveBalance: number;
  services: number;
};

export class User {
  id: number;
  roleId: number;
  email: string;
  isEmailVerified: number;
  status: number;
  kycStatus: number;
  kyc: Record<string, any> | null;
  lastIpAddress: string | null;
  lastCountryName: string | null;
  passwordUpdated: number;
  referredBy: string | null;
  referralCode: string | null;
  otpCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
  permission: Permission;
  customer?: Customer;
  merchant?: Merchant;
  agent?: Agent; // Define the type or interface if you have the structure

  constructor(user: any) {
    this.id = user.id;
    this.roleId = user.roleId;
    this.email = user.email;
    this.isEmailVerified = user.isEmailVerified;
    this.status = user.status;
    this.kycStatus = user.kycStatus;
    this.kyc = user.kyc || null;
    this.lastIpAddress = user.lastIpAddress;
    this.lastCountryName = user.lastCountryName;
    this.passwordUpdated = user.passwordUpdated;
    this.referredBy = user.referredBy;
    this.referralCode = user.referralCode;
    this.otpCode = user.otpCode;
    this.createdAt = new Date(user.createdAt);
    this.updatedAt = new Date(user.updatedAt);
    this.role = new Role(user.role);
    this.permission = user.permission;
    this.customer = user?.customer ? new Customer(user.customer) : undefined;
    this.merchant = user?.merchant ? new Merchant(user.merchant) : undefined;
    this.agent = user?.agent ? new Agent(user.agent) : undefined;
  }

  getKYCStatus = () => {
    return Boolean(this.kycStatus);
  };

  canMakeDeposit() {
    return Boolean(this.permission.deposit);
  }

  canMakeTransfer() {
    return Boolean(this.permission.transfer);
  }

  canMakeWithdraw() {
    return Boolean(this.permission.withdraw);
  }

  canMakeExchange() {
    return Boolean(this.permission.exchange);
  }

  canMakePayment() {
    return Boolean(this.permission.payment);
  }

  canMakeService() {
    return Boolean(this.permission.services);
  }

  hasAccountCreationPermission() {
    return Boolean(this.permission.services);
  }

  canModifyUserBalance() {
    return Boolean(this.permission.services);
  }

  getReferralCode = () => {
    return this.referralCode;
  };

  getReferralLink = () => {
    if (!this.referralCode) return "";
    return `${configs.APP_URL}/register?referral=${this.referralCode}`;
  };
}
