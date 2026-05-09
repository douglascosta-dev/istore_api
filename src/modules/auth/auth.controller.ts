import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: UserResquest): Promise<TokenResponse> {
    const user: UserResponse = req.user;
    const token: TokenResponse = await this.authService.login(user);
    console.log('Deu certo: ', token);
    return token;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDTO): Promise<TokenResponse> {
    const token: TokenResponse = await this.authService.refreshToken(body);
    return token;
  }

  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Request() req: UserRequestToken,
    @Body() body: ChangeUserPasswordDTO,
  ): Promise<void> {
    const id = req.user.id;
    return await this.authService.changePassword(id, body);
  }
  @Public()
  @Post('forget-password')
  async forgetPassword(@Body('email') email: string): Promise<void> {
    return await this.authService.forgetPassword(email);
  }
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: PasswordResetDTO): Promise<void> {
    return await this.authService.resetPassword(body);
  }
}
