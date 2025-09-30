import { User } from "@/types/auth";

export class CustomerContact {
  id: number;
  userId: number;
  contactId: number;
  createdAt: Date;
  updatedAt: Date;
  contact: User;

  constructor(data: any) {
    this.id = data?.id;
    this.userId = data?.userId;
    this.contactId = data?.contactId;
    this.createdAt = new Date(data?.createdAt);
    this.updatedAt = new Date(data?.updatedAt);
    this.contact = new User(data?.contact);
  }
}
