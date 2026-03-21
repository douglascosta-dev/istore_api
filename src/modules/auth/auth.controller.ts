import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ChangeUserPasswordDTO } from './dtos/change-password.dto';
import { AuthService } from './auth.service';
import { PasswordResetDTO } from './dtos/password-reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Patch(':id/change-password')
  async changePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: ChangeUserPasswordDTO,
  ): Promise<void> {
    return await this.authService.changePassword(id, body);
  }

  @Post('forget-password')
  async forgetPassword(@Body('email') email: string): Promise<void> {
    return await this.authService.forgetPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: PasswordResetDTO): Promise<void> {
    return await this.authService.resetPassword(body);
  }
}
