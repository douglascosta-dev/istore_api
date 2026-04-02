import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateAddressNestedDto } from 'src/modules/address/dto/create-address-nested.dto';
import { CreateCellphoneNestedDto } from 'src/modules/cellphones/dto/create-cellphone-nested.dto';

export class CreateUserDto {
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
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCellphoneNestedDto)
  readonly cellphones: CreateCellphoneNestedDto[];
  @IsArray()
  @IsNotEmpty()
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
  @IsUUID()
  @IsNotEmpty()
  roleId: string;
}
