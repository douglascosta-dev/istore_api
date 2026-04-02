import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateCellphoneNestedDto } from '../cellphones/dto/create-cellphone-nested.dto';
import { Type } from 'class-transformer';
import { CreateAddressNestedDto } from '../address/dto/create-address-nested.dto';

export class CreateClientUserDTO {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCellphoneNestedDto)
  readonly cellphones: CreateCellphoneNestedDto[];
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressNestedDto)
  readonly address: CreateAddressNestedDto[];
  @IsString()
  @IsNotEmpty()
  @MaxLength(11)
  readonly cpf: string;
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
