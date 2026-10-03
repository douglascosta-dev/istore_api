import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDTO {
  @ApiProperty({
    example: 'read:user',
    description: 'Nome único da permissão (ex: recurso:ação)',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
