import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateAddressDTO } from 'src/modules/address/dto/create-adress.dto';
import { CreateCellphoneDTO } from 'src/modules/cellphones/dto/create-cellphone.dto';
import { RoleEnum } from 'src/modules/roles/enuns/role.enum';

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
  readonly cellphones: CreateCellphoneDTO[];
  @IsArray()
  @IsNotEmpty()
  readonly address: CreateAddressDTO[];
  @IsString()
  @IsNotEmpty()
  @MaxLength(11)
  readonly cpf: string;
  @IsString()
  @IsNotEmpty()
  readonly password: string;
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  readonly role: RoleEnum;
}
