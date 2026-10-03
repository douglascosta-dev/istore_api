import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordResetDTO {
  @ApiProperty({
    example: '302fab21256bb27e6fcfabd56acd332b655a0b70ab7d75aa19b3ed9290122f54',
    description: 'Token recebido por e-mail para recuperação de senha',
  })
  @IsString()
  @IsNotEmpty()
  readonly token: string;

  @ApiProperty({
    example: 'cad453ee1a8de620aaed65b50e499030',
    description: 'ID do token de recuperação de senha',
  })
  @IsString()
  @IsNotEmpty()
  readonly tokenId: string;

  @ApiProperty({
    example: '123456',
    description: 'Nova senha a ser cadastrada',
  })
  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;
}
