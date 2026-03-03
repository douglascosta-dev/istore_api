import { Expose } from 'class-transformer';

export class RoleResponse {
  @Expose()
  readonly id: string;
  @Expose()
  readonly name: string;
  @Expose()
  readonly createdAt: Date;
}
