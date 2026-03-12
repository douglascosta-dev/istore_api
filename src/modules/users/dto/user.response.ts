import { Expose, Type } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { AddressResponse } from 'src/modules/address/dto/address.response';
import { CellphoneResponse } from 'src/modules/cellphones/dto/cellphone.response';
import { RoleResponse } from 'src/modules/roles/dto/role.response';

export class UserResponse {
  @Expose()
  id: string;
  @Expose()
  readonly firstName: string;
  @Expose()
  readonly lastName: string;
  @Expose()
  readonly email: string;
  @Expose()
  @Type(() => CellphoneResponse)
  readonly cellphones: CellphoneResponse[];
  @Expose()
  @Type(() => AddressResponse)
  readonly address: AddressResponse[];
  @Expose()
  readonly cpf: string;
  @Expose()
  @IsUUID()
  @Type(() => RoleResponse)
  readonly role: RoleResponse;
  @Expose()
  readonly createdAt: Date;
}
