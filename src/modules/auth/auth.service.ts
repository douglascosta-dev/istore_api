import { UserResponse } from './../users/dto/user.response';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ChangeUserPasswordDTO } from './dtos/change-password.dto';
import { ForgetPasswordDTO } from './dtos/forget-password.dto';
import { randomBytes } from 'crypto';
import { EmailService } from 'src/common/services/email.service';
import { PasswordReset } from './entities/password-reset.entity';
import { PasswordResetDTO } from './dtos/password-reset.dto';
import { TokenResponse } from './dtos/token.response';
import { JwtService } from '@nestjs/jwt';
import { CreateUserToken } from './dtos/create-user-token.dto';
import { RefreshTokenDTO } from './dtos/refresh-token.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async validadeUser(email: string, password: string): Promise<UserResponse> {
    if (!email)
      throw new HttpException('Email é obrigatório', HttpStatus.BAD_REQUEST);

    if (!password)
      throw new HttpException('Senha é obrigatório', HttpStatus.BAD_REQUEST);

    const user: User | null = await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: ['id', 'email', 'passwordHash', 'firstName', 'refreshToken'],
      relations: ['role'],
    });

    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    const validatePassword: boolean = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!validatePassword)
      throw new HttpException('Senha inválida', HttpStatus.UNAUTHORIZED);

    return plainToInstance(UserResponse, user, {
      excludeExtraneousValues: true,
    });
  }

  async login(user: UserResponse): Promise<TokenResponse> {
    const userData: UserResponse = user;
    if (!userData)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    const payload: CreateUserToken = {
      id: userData.id,
      email: userData.email,
      role: userData.role?.name,
    };

    const accessToken: string = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS,
      expiresIn: '15m',
    });

    const refreshToken: string = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH,
      expiresIn: '7d',
    });

    const hashRefresh: string = await bcrypt.hash(refreshToken, 10);

    await this.userRepository.update(user.id, {
      refreshToken: hashRefresh,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    } as TokenResponse;
  }

  async refreshToken(userToken: RefreshTokenDTO): Promise<TokenResponse> {
    const token: string = userToken.refreshToken;
    let payload: CreateUserToken;

    try {
      payload = this.jwtService.verify<CreateUserToken>(token, {
        secret: process.env.JWT_REFRESH,
      });
    } catch {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }

    const user: User | null = await this.userRepository.findOne({
      where: { id: payload.id },
      select: ['id', 'email', 'firstName', 'refreshToken'],
      relations: ['role'],
    });

    if (!user || !user.refreshToken) {
      throw new HttpException('Não autorizado', HttpStatus.UNAUTHORIZED);
    }

    const validateToken: boolean = await bcrypt.compare(
      userToken.refreshToken,
      user.refreshToken,
    );

    if (!validateToken)
      throw new HttpException('Não autorizado', HttpStatus.UNAUTHORIZED);

    const newPayload: CreateUserToken = {
      id: user.id,
      email: user.email,
      role: user.role?.name,
    };

    const newToken: string = this.jwtService.sign(newPayload, {
      secret: process.env.JWT_ACCESS,
      expiresIn: '15m',
    });

    const newRefresh: string = this.jwtService.sign(newPayload, {
      secret: process.env.JWT_REFRESH,
      expiresIn: '7d',
    });

    const newRefreshHash: string = await bcrypt.hash(newRefresh, 10);

    await this.userRepository.update(user.id, {
      refreshToken: newRefreshHash,
    });

    return { accessToken: newToken, refreshToken: newRefresh } as TokenResponse;
  }

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

    if (passwordReset.expiresAt < new Date())
      throw new HttpException('Token expirado', HttpStatus.UNAUTHORIZED);

    const tokenMatch: boolean = await bcrypt.compare(
      body.token,
      passwordReset.resetPasswordTokenHash,
    );

    if (!tokenMatch)
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);

    const newPasswordHash: string = await bcrypt.hash(body.newPassword, 10);

    await this.userRepository.update(user.id, {
      passwordHash: newPasswordHash,
    });

    await this.passwordResetRepository.delete({
      user: { id: user.id },
    });
  }
}
