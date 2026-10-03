import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCellphoneDTO {
  @ApiProperty({
    example: '11987654321',
    description: 'Número de telefone/celular com DDD',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  readonly number: string;

  @ApiProperty({
    example: 'd3b07384-d113-4f96-857c-d07bfd7a5b6c',
    description: 'ID do usuário proprietário (UUID)',
  })
  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
