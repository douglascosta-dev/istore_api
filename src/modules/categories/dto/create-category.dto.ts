import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCategoryDTO {
  @ApiProperty({
    example: 'Smartphones',
    description: 'Nome da categoria',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: true,
    description: 'Indica se a categoria está ativa e visível na loja',
    default: true,
  })
  @IsBoolean()
  readonly enabled: boolean;

  @ApiProperty({
    example: 1,
    description: 'Ordem de exibição da categoria',
    default: 1,
  })
  @IsNumber()
  readonly order: number;

  @ApiPropertyOptional({
    example: 'b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID da imagem associada à categoria (UUID)',
  })
  @IsOptional()
  @IsString()
  imageId: string;
}
