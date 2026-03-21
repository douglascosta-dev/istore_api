import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenDTO {
  @IsString()
  @IsNotEmpty()
  readonly accessToken: string;
}
