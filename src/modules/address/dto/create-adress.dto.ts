import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAddressDTO {
  @ApiProperty({
    example: '01310100',
    description: 'CEP do endereço (apenas dígitos)',
  })
  @IsString()
  @IsNotEmpty()
  readonly zipcode: string;

  @ApiProperty({
    example: 'Avenida Paulista',
    description: 'Logradouro / Rua',
  })
  @IsString()
  @IsNotEmpty()
  readonly street: string;

  @ApiProperty({
    example: 1000,
    description: 'Número do imóvel',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly number: number;

  @ApiPropertyOptional({
    example: 'Apto 101',
    description: 'Complemento do endereço',
  })
  @IsString()
  @IsOptional()
  readonly complement?: string;

  @ApiProperty({
    example: 'Bela Vista',
    description: 'Bairro',
  })
  @IsString()
  @IsNotEmpty()
  readonly neighborhood: string;

  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade',
  })
  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @ApiProperty({
    example: 'SP',
    description: 'Estado (UF)',
  })
  @IsString()
  @IsNotEmpty()
  readonly state: string;

  @ApiProperty({
    example: true,
    description: 'Define se este é o endereço padrão de entrega',
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  readonly default: boolean;

  @ApiProperty({
    example: 'd3b07384-d113-4f96-857c-d07bfd7a5b6c',
    description: 'ID do usuário proprietário (UUID)',
  })
  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
