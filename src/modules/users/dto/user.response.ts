import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { AddressResponse } from 'src/modules/address/dto/address.response';
import { CellphoneResponse } from 'src/modules/cellphones/dto/cellphone.response';
import { RoleResponse } from 'src/modules/roles/dto/role.response';

export class UserResponse {
  @ApiProperty({
    example: 'd3b07384-d113-4f96-857c-d07bfd7a5b6c',
    description: 'ID único do usuário (UUID)',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'João',
    description: 'Primeiro nome',
  })
  @Expose()
  readonly firstName: string;

  @ApiProperty({
    example: 'Silva',
    description: 'Sobrenome',
  })
  @Expose()
  readonly lastName: string;

  @ApiProperty({
    example: 'joao.silva@email.com',
    description: 'E-mail do usuário',
  })
  @Expose()
  readonly email: string;

  @ApiProperty({
    type: () => [CellphoneResponse],
    description: 'Telefones cadastrados do usuário',
  })
  @Expose()
  @Type(() => CellphoneResponse)
  readonly cellphones: CellphoneResponse[];

  @ApiProperty({
    type: () => [AddressResponse],
    description: 'Endereços cadastrados do usuário',
  })
  @Expose()
  @Type(() => AddressResponse)
  readonly address: AddressResponse[];

  @ApiProperty({
    example: '12345678901',
    description: 'CPF do usuário',
  })
  @Expose()
  readonly cpf: string;

  @ApiProperty({
    type: () => RoleResponse,
    description: 'Perfil de permissões (role) do usuário',
  })
  @Expose()
  @IsUUID()
  @Type(() => RoleResponse)
  readonly role: RoleResponse;

  @ApiProperty({
    example: '2026-03-20T12:00:00.000Z',
    description: 'Data de criação do usuário',
  })
  @Expose()
  readonly createdAt: Date;
}
