export type Type = "wallet" | "merchant" | "phone" | "electricity";

export class FavoriteItem {
  id: number;
  userId: number;
  type: Type;
  info: {
    image?: string;
    label?: string;
    email?: string;
  } | null;
  value: string;
  metadata: Record<string, string | number> | null;
  isBookmarked: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(data: any) {
    this.id = data?.id;
    this.userId = data?.userId;
    this.type = data?.type;
    this.info = data?.info ? JSON.parse(data.info) : null;
    this.value = data?.value;
    this.metadata = data?.metaData ? JSON.parse(data.metaData) : null;
    this.isBookmarked = Boolean(data?.isBookmarked);
    this.createdAt = data?.createdAt ? new Date(data.createdAt) : null;
    this.updatedAt = data?.updatedAt ? new Date(data.updatedAt) : null;
  }

  getInfo() {
    return {
      ...this.info,
      image: this.info?.image,
      label:
        this.type === "wallet" ? this.metadata?.currency : this.info?.label,
    };
  }
}
