import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { UpdateAdressDTO } from 'src/modules/address/dto/update-adress.dto';
import { UpdateCellphoneDTO } from 'src/modules/cellphones/dto/update-cellphone.dto';
import { RoleEnum } from 'src/modules/roles/enuns/role.enum';

export class UpdateUserDTO {
  @ApiPropertyOptional({
    example: 'João',
    description: 'Primeiro nome',
  })
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @ApiPropertyOptional({
    example: 'Silva Santos',
    description: 'Sobrenome',
  })
  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @ApiPropertyOptional({
    type: () => [UpdateCellphoneDTO],
    description: 'Telefones do usuário para atualização',
  })
  @IsArray()
  @IsOptional()
  readonly cellphones?: UpdateCellphoneDTO[];

  @ApiPropertyOptional({
    type: () => [UpdateAdressDTO],
    description: 'Endereços do usuário para atualização',
  })
  @IsArray()
  @IsOptional()
  readonly address?: UpdateAdressDTO[];

  @ApiPropertyOptional({
    enum: RoleEnum,
    description: 'Perfil de acesso do usuário',
    example: RoleEnum.Client,
  })
  @IsEnum(RoleEnum)
  @IsOptional()
  readonly role?: RoleEnum;
}
