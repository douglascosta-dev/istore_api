import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCellphoneDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  readonly number: string;
  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
