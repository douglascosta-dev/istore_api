import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CellphoneUserDTO } from 'src/modules/users/dto/cellphone-user.dto';

export class CellphoneUserResponse {
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
    type: () => CellphoneUserDTO,
    description: 'Usuário proprietário do telefone',
  })
  @Expose()
  @Type(() => CellphoneUserDTO)
  readonly user?: {
    id: string;
    firstName: string;
  };
}
