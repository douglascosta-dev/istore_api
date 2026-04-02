import { Expose } from 'class-transformer';

export class CellphoneResponse {
  @Expose()
  readonly id: string;
  @Expose()
  readonly number: string;
  @Expose()
  readonly userId?: string;
}
