import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';

export class FindAddressQueryDTO extends PaginationQueryDTO {
  @ApiPropertyOptional({
    description: 'Filtrar por CEP',
    example: '01310100',
  })
  @IsString()
  @IsOptional()
  readonly zipcode?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por logradouro/rua',
    example: 'Paulista',
  })
  @IsString()
  @IsOptional()
  readonly street?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por bairro',
    example: 'Bela Vista',
  })
  @IsString()
  @IsOptional()
  readonly neighborhood?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por cidade',
    example: 'São Paulo',
  })
  @IsString()
  @IsOptional()
  readonly city?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado (UF)',
    example: 'SP',
  })
  @IsString()
  @IsOptional()
  readonly state?: string;
}
