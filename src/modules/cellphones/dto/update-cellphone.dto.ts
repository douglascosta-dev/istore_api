import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateCellphoneDTO {
  @ApiProperty({
    example: '11999998888',
    description: 'Novo número de telefone/celular com DDD',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  readonly number: string;
}
