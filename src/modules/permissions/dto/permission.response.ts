import { Expose } from 'class-transformer';

export class PermissionResponse {
  @Expose()
  readonly id: string;
  @Expose()
  readonly name: string;
}
