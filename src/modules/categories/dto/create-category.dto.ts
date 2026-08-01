import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsBoolean()
  readonly enabled: boolean;
  @IsNumber()
  readonly order: number;
  @IsOptional()
  @IsString()
  imageId: string;
}
