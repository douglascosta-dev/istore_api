import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CellphoneResponse {
  @ApiProperty({
    example: 'f2e3d4c5-b6a7-8901-2345-6789abcdef01',
    description: 'ID do telefone (UUID)',
  })
  @Expose()
  readonly id: string;

  @ApiProperty({
    example: '11987654321',
    description: 'Número do telefone/celular',
  })
  @Expose()
  readonly number: string;

  @ApiPropertyOptional({
    example: 'd3b07384-d113-4f96-857c-d07bfd7a5b6c',
    description: 'ID do usuário associado (UUID)',
  })
  @Expose()
  readonly userId?: string;
}
