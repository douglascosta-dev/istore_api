import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CellphoneUserDTO {
  @ApiProperty({
    example: 'd3b07384-d113-4f96-857c-d07bfd7a5b6c',
    description: 'ID do usuário',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'João',
    description: 'Primeiro nome do usuário',
  })
  @Expose()
  firstName: string;
}
