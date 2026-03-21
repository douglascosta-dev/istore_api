import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ChangeUserPasswordDTO } from './dtos/change-password.dto';
import { ForgetPasswordDTO } from './dtos/forget-password.dto';
import { randomBytes } from 'crypto';
import { EmailService } from 'src/common/services/email.service';
import { PasswordReset } from './entities/password-reset.entity';
import { PasswordResetDTO } from './dtos/password-reset.dto';

export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    private readonly emailService: EmailService,
  ) {}
  async changePassword(id: string, body: ChangeUserPasswordDTO): Promise<void> {
    const user: User | null = await this.userRepository.findOne({
      where: {
        id,
      },
      select: ['id', 'passwordHash'],
    });

    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    const passwordMatch: boolean = await bcrypt.compare(
      body.currentPassword,
      user.passwordHash,
    );

    if (!passwordMatch)
      throw new HttpException('Senha atual incorreta', HttpStatus.BAD_REQUEST);

    const newPasswordHash: string = await bcrypt.hash(body.newPassword, 10);
    user.passwordHash = newPasswordHash;
    await this.userRepository.save(user);
  }

  async forgetPassword(email: string): Promise<void> {
    const user: User | null = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) return;

    await this.passwordResetRepository.delete({
      user: { id: user.id },
    });

    const token: string = randomBytes(32).toString('hex');
    const tokenId: string = randomBytes(16).toString('hex');
    const tokenHash: string = await bcrypt.hash(token, 10);
    const tokenExp: Date = new Date(Date.now() + 1000 * 60 * 15);

    const resetPasswordPayload: PasswordReset =
      this.passwordResetRepository.create({
        user: user,
        resetPasswordTokenHash: tokenHash,
        tokenId: tokenId,
        expiresAt: tokenExp,
      });

    const passwordResetSaved: PasswordReset =
      await this.passwordResetRepository.save(resetPasswordPayload);

    if (!passwordResetSaved) throw new InternalServerErrorException();

    const emailPayload: ForgetPasswordDTO = {
      email: user.email,
      token: token,
      tokenId: tokenId,
    };

    await this.emailService.sendPasswordReset(emailPayload);
  }

  async resetPassword(body: PasswordResetDTO): Promise<void> {
    const passwordReset: PasswordReset | null =
      await this.passwordResetRepository.findOne({
        where: {
          tokenId: body.tokenId,
        },
        select: ['id', 'user', 'resetPasswordTokenHash', 'expiresAt'],
      });

    if (!passwordReset)
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);

    const user: User | null = await this.userRepository.findOne({
      where: {
        id: passwordReset.userId,
      },
      select: ['id', 'passwordHash'],
    });

    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    const tokenMatch: boolean = await bcrypt.compare(
      body.token,
      passwordReset.resetPasswordTokenHash,
    );

    if (passwordReset.expiresAt < new Date())
      throw new HttpException('Token expirado', HttpStatus.UNAUTHORIZED);

    if (!tokenMatch)
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);

    const newPasswordHash: string = await bcrypt.hash(body.newPassword, 10);
    user.passwordHash = newPasswordHash;

    await this.userRepository.save(user);
    await this.passwordResetRepository.delete({
      user: { id: user.id },
    });
  }
}
