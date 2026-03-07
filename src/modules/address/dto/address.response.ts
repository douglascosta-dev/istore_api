import { Expose } from 'class-transformer';

export class AddressResponse {
  @Expose()
  readonly id: string;
  @Expose()
  readonly zipcode: string;
  @Expose()
  readonly street: string;
  @Expose()
  readonly number: number;
  @Expose()
  readonly complement: string;
  @Expose()
  readonly neighborhood: string;
  @Expose()
  readonly city: string;
  @Expose()
  readonly state: string;
  @Expose()
  readonly default: boolean;
  @Expose()
  readonly createdAt: Date;
}
