import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateCellphoneDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  readonly number: string;
}
