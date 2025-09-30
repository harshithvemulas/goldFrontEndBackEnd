import { Address } from "@/types/address";
import { Role } from "@/types/role";
import { shapePhoneNumber } from "@/lib/utils";

export type TUser = {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  roleId: number;
  phone: string;
  email: string;
  isEmailVerified: number;
  status: number;
  kycStatus: number;
  lastIpAddress: string | null;
  lastCountryName: string | null;
  passwordUpdated: number;
  referredBy: string | null;
  otpCode: string | null;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  role?: Role | null;
  dateOfBirth?: Date | null | undefined;
  gender?: "male" | "female";
  avatar?: string | null;
};

export class User {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  roleId: number;
  email: string;
  phone: string;
  isEmailVerified: number;
  status: number;
  kycStatus: number;
  lastIpAddress: string | null;
  lastCountryName: string | null;
  passwordUpdated: number;
  referredBy: string | null;
  otpCode: string | null;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  role?: Role | null;
  dateOfBirth?: Date | null | undefined;
  gender?: "male" | "female";
  avatar?: string | null;
  address: Address | null;
  merchant: any | null;
  agent: any | null;

  constructor(user: any) {
    this.id = user?.id;
    this.name = user?.name;
    this.firstName = user?.firstName;
    this.lastName = user?.lastName;
    this.avatar = user?.avatar;
    this.roleId = user?.roleId;
    this.phone = shapePhoneNumber(user?.phone);
    this.email = user?.email;
    this.isEmailVerified = user?.isEmailVerified;
    this.status = user?.status;
    this.kycStatus = user?.kycStatus;
    this.lastIpAddress = user?.lastIpAddress;
    this.lastCountryName = user?.lastCountryName;
    this.passwordUpdated = user?.passwordUpdated;
    this.referredBy = user?.referredBy;
    this.otpCode = user?.otpCode;
    this.createdAt = user?.createdAt ? new Date(user?.createdAt) : undefined;
    this.updatedAt = user?.updatedAt ? new Date(user?.updatedAt) : undefined;
    this.role = new Role(user?.role);
    this.dateOfBirth = user?.dob ? new Date(user?.dob) : undefined;
    this.gender = user?.gender;
    this.address = user?.address ? new Address(user?.address) : null;
  }
}
