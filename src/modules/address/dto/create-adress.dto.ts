import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAddressDTO {
  @IsString()
  @IsNotEmpty()
  readonly zipcode: string;
  @IsString()
  @IsNotEmpty()
  readonly street: string;
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly number: number;
  @IsString()
  @IsOptional()
  readonly complement?: string;
  @IsString()
  @IsNotEmpty()
  readonly neighborhood: string;
  @IsString()
  @IsNotEmpty()
  readonly city: string;
  @IsString()
  @IsNotEmpty()
  readonly state: string;
  @IsBoolean()
  @IsNotEmpty()
  readonly default: boolean;
  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
