import { Expose } from 'class-transformer';

export class TokenResponse {
  @Expose()
  readonly accessToken: string;
  @Expose()
  readonly refreshToken: string;
}
