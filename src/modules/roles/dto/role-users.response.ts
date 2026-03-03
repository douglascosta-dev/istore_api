import { Expose, Type } from 'class-transformer';
import { UserResponse } from 'src/modules/users/dto/user.response';

export class RoleUsersResponse {
  @Expose()
  readonly id: string;
  @Expose()
  readonly name: string;
  @Expose()
  @Type(() => UserResponse)
  readonly users: UserResponse[];
  @Expose()
  readonly createdAt: Date;
}
