import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AddressResponse {
  @ApiProperty({
    example: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID do endereço (UUID)',
  })
  @Expose()
  readonly id: string;

  @ApiProperty({
    example: '01310100',
    description: 'CEP do endereço',
  })
  @Expose()
  readonly zipcode: string;

  @ApiProperty({
    example: 'Avenida Paulista',
    description: 'Logradouro / Rua',
  })
  @Expose()
  readonly street: string;

  @ApiProperty({
    example: 1000,
    description: 'Número do imóvel',
  })
  @Expose()
  readonly number: number;

  @ApiPropertyOptional({
    example: 'Apto 101',
    description: 'Complemento do endereço',
  })
  @Expose()
  readonly complement?: string;

  @ApiProperty({
    example: 'Bela Vista',
    description: 'Bairro',
  })
  @Expose()
  readonly neighborhood: string;

  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade',
  })
  @Expose()
  readonly city: string;

  @ApiProperty({
    example: 'SP',
    description: 'Estado (UF)',
  })
  @Expose()
  readonly state: string;

  @ApiProperty({
    example: true,
    description: 'Indica se é o endereço padrão',
  })
  @Expose()
  readonly default: boolean;

  @ApiProperty({
    example: 'd3b07384-d113-4f96-857c-d07bfd7a5b6c',
    description: 'ID do usuário proprietário (UUID)',
  })
  @Expose()
  readonly userId: string;

  @ApiProperty({
    example: '2026-03-20T12:00:00.000Z',
    description: 'Data de criação do endereço',
  })
  @Expose()
  readonly createdAt: Date;
}
