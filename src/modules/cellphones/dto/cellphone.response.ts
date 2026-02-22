import { Expose } from 'class-transformer';

export class CellphonResponse {
  @Expose()
  readonly number: string;
}
