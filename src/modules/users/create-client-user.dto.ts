import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'Maria',
    description: 'Primeiro nome',
  })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({
    example: 'Oliveira',
    description: 'Sobrenome',
  })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    example: 'maria.oliveira@email.com',
    description: 'E-mail do cliente',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiPropertyOptional({
    type: () => [CreateCellphoneNestedDto],
    description: 'Telefones de contato (opcional)',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCellphoneNestedDto)
  readonly cellphones: CreateCellphoneNestedDto[];

  @ApiPropertyOptional({
    type: () => [CreateAddressNestedDto],
    description: 'Endereços do cliente (opcional)',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressNestedDto)
  readonly address: CreateAddressNestedDto[];

  @ApiProperty({
    example: '98765432100',
    description: 'CPF do cliente (apenas dígitos)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(11)
  readonly cpf: string;

  @ApiProperty({
    example: 'SenhaSegura123!',
    description: 'Senha da conta',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
