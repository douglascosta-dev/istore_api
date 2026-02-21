import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { UpdateAdressDTO } from 'src/modules/address/dto/update-adress.dto';
import { UpdateCellphoneDTO } from 'src/modules/cellphones/dto/update-cellphone.dto';
import { RoleEnum } from 'src/modules/roles/enuns/role.enum';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  readonly firstName: string;
  @IsString()
  @IsOptional()
  readonly lastName: string;
  @IsArray()
  @IsOptional()
  readonly cellphones: UpdateCellphoneDTO[];
  @IsArray()
  @IsOptional()
  readonly address: UpdateAdressDTO[];
  @IsString()
  @IsOptional()
  readonly password: string;
  @IsEnum(RoleEnum)
  @IsOptional()
  readonly role: RoleEnum;
}
