import { Expose } from 'class-transformer';

export class AccessTokenResponse {
  @Expose()
  readonly accessToken: string;
}
