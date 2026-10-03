import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PermissionResponse {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID da permissão (UUID)',
  })
  @Expose()
  readonly id: string;

  @ApiProperty({
    example: 'read:user',
    description: 'Nome da permissão',
  })
  @Expose()
  readonly name: string;
}
