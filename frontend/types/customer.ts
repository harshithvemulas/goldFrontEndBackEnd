import { Address } from "@/types/address";

export class Customer {
  id: number;
  userId: number;
  name: string;
  email?: string;
  phone: string;
  gender: string;
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  address?: Address;

  constructor(customer: any) {
    this.id = customer?.id;
    this.userId = customer?.userId;
    this.name = customer?.name;
    this.email = customer?.user?.email;
    this.phone = customer?.phone?.match(/^\+/)
      ? customer.phone
      : `+${customer?.phone}`;
    this.gender = customer?.gender;
    this.dob = new Date(customer?.dob);
    this.avatar = customer?.profileImage;
    this.address = new Address(customer?.address);
    this.createdAt = new Date(customer?.createdAt);
    this.updatedAt = new Date(customer?.updatedAt);
  }
}
