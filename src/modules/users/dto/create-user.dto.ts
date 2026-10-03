import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'João',
    description: 'Primeiro nome',
  })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({
    example: 'Silva',
    description: 'Sobrenome',
  })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    example: 'joao.silva@email.com',
    description: 'E-mail do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    type: () => [CreateCellphoneNestedDto],
    description: 'Lista de telefones para contato',
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCellphoneNestedDto)
  readonly cellphones: CreateCellphoneNestedDto[];

  @ApiProperty({
    type: () => [CreateAddressNestedDto],
    description: 'Lista de endereços do usuário',
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressNestedDto)
  readonly address: CreateAddressNestedDto[];

  @ApiProperty({
    example: '12345678901',
    description: 'CPF (somente números, até 11 caracteres)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(11)
  readonly cpf: string;

  @ApiProperty({
    example: 'SenhaForte123!',
    description: 'Senha de acesso do usuário',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    example: 'c2b425b0-9b43-4610-8ec4-ff7036d390a8',
    description: 'ID da role/perfil de acesso atribuído ao usuário',
  })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;
}
