import { Expose, Type } from 'class-transformer';
import { AddressResponse } from 'src/modules/address/dto/address.response';
import { CellphoneResponse } from 'src/modules/cellphones/dto/cellphone.response';
import { RoleEnum } from 'src/modules/roles/enuns/role.enum';

export class UserResponse {
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
  @Type(() => CellphoneResponse)
  readonly address: AddressResponse[];
  @Expose()
  readonly cpf: string;
  @Expose()
  readonly role: RoleEnum;
  @Expose()
  readonly createdAt: Date;
}
