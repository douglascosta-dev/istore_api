import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChangeUserPasswordDTO } from './dtos/change-password.dto';
import { AuthService } from './auth.service';
import { PasswordResetDTO } from './dtos/password-reset.dto';
import { TokenResponse } from './dtos/token.response';
import { RefreshTokenDTO } from './dtos/refresh-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserResponse } from '../users/dto/user.response';
import { UserResquest } from './dtos/user-request.response';
import { UserRequestToken } from './dtos/user-requet-token.response';
import { Public } from 'src/common/decorators/public-permission.decorator';
import { LoginDto } from './dtos/login.dto';
import { RequestForgetPasswordDTO } from './dtos/request-forget-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({
    summary: 'Autenticar usuário',
    description:
      'Valida as credenciais do usuário e retorna tokens de acesso JWT.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Autenticação bem-sucedida',
    type: TokenResponse,
  })
  @ApiResponse({ status: 401, description: 'E-mail ou senha inválidos' })
  async login(@Request() req: UserResquest): Promise<TokenResponse> {
    const user: UserResponse = req.user;
    const token: TokenResponse = await this.authService.login(user);
    console.log('Deu certo: ', token);
    return token;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('refresh-token')
  @ApiOperation({
    summary: 'Renovar access token',
    description:
      'Gera novos tokens de acesso a partir de um refresh token válido.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens renovados com sucesso',
    type: TokenResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido ou expirado',
  })
  async refreshToken(@Body() body: RefreshTokenDTO): Promise<TokenResponse> {
    const token: TokenResponse = await this.authService.refreshToken(body);
    return token;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Patch('change-password')
  @ApiOperation({
    summary: 'Alterar senha do usuário autenticado',
    description:
      'Permite alterar a senha mediante fornecimento da senha atual.',
  })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  @ApiResponse({ status: 400, description: 'Senha atual incorreta' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async changePassword(
    @Request() req: UserRequestToken,
    @Body() body: ChangeUserPasswordDTO,
  ): Promise<void> {
    const id = req.user.id;
    return await this.authService.changePassword(id, body);
  }

  @Public()
  @Post('forget-password')
  @ApiOperation({
    summary: 'Solicitar recuperação de senha',
    description: 'Gera e envia por e-mail um token para redefinição de senha.',
  })
  @ApiResponse({
    status: 200,
    description: 'Instruções enviadas para o e-mail, se cadastrado',
  })
  async forgetPassword(@Body() body: RequestForgetPasswordDTO): Promise<void> {
    return await this.authService.forgetPassword(body.email);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({
    summary: 'Redefinir senha com token',
    description:
      'Redefine a senha do usuário utilizando o token recebido por e-mail.',
  })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async resetPassword(@Body() body: PasswordResetDTO): Promise<void> {
    return await this.authService.resetPassword(body);
  }
}
