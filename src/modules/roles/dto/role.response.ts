import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RoleResponse {
  @ApiProperty({
    example: 'c2b425b0-9b43-4610-8ec4-ff7036d390a8',
    description: 'ID da role (UUID)',
  })
  @Expose()
  readonly id: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Nome da role',
  })
  @Expose()
  readonly name: string;

  @ApiProperty({
    example: '2026-03-20T12:00:00.000Z',
    description: 'Data de criação da role',
  })
  @Expose()
  readonly createdAt: Date;
}
