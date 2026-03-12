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
import { CreateAddressDTO } from 'src/modules/address/dto/create-adress.dto';
import { CreateCellphoneDTO } from 'src/modules/cellphones/dto/create-cellphone.dto';

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
  @Type(() => CreateCellphoneDTO)
  readonly cellphones: CreateCellphoneDTO[];
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDTO)
  readonly address: CreateAddressDTO[];
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
