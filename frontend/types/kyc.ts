import { imageURL } from "@/lib/utils";

export class KYC {
  id: number;
  userId: number;
  documentType: "NID" | "PASSPORT" | "DRIVING";
  selfie?: string | undefined;
  front: string;
  back?: string | undefined;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Record<string, any>) {
    this.id = data?.id;
    this.userId = data?.userId;
    this.documentType = data?.documentType?.toUpperCase();
    this.selfie = imageURL(data?.selfie);
    this.front = imageURL(data?.front);
    this.back = imageURL(data?.back);
    this.status = data?.status;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
  }
}
