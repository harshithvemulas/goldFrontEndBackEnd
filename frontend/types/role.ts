export class Role {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(role: any) {
    this.id = role?.id;
    this.name = role?.name;
    this.createdAt = new Date(role?.createdAt);
    this.updatedAt = new Date(role?.updatedAt);
  }
}
