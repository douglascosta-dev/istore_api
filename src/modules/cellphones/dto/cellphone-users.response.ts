import { Expose, Type } from 'class-transformer';
import { CellphoneUserDTO } from 'src/modules/users/dto/cellphone-user.dto';

export class CellphoneUserResponse {
  @Expose()
  readonly id: string;
  @Expose()
  readonly number: string;
  @Expose()
  @Type(() => CellphoneUserDTO)
  readonly user?: {
    id: string;
    firstName: string;
  };
}
