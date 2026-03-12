import { Expose } from 'class-transformer';

export class CellphoneUserDTO {
  @Expose()
  id: string;

  @Expose()
  firstName: string;
}
