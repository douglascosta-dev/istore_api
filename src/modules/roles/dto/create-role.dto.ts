import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
