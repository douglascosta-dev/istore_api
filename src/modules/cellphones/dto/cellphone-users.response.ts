import { Expose } from 'class-transformer';

export class CellphoneUserResponse {
  @Expose()
  readonly id: string;
  @Expose()
  readonly number: string;
  @Expose()
  readonly user?: {
    id: string;
    name: string;
  };
}
