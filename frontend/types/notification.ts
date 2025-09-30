export class Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  isSystem: boolean;
  navigate: string;
  userId: number;
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(n: any) {
    this.id = n?.id;
    this.type = n?.type;
    this.title = n?.title;
    this.body = n?.body;
    this.isRead = Boolean(n?.isRead);
    this.isSystem = Boolean(n?.isSystem);
    this.navigate = n?.navigate;
    this.userId = n?.userId;
    this.createdAt = n?.createdAt;
    this.updatedAt = n?.updatedAt;
  }
}
