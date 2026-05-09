import { LocalStrategy } from './strategies/local.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailService } from 'src/common/services/email.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordReset]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, LocalStrategy, JwtStrategy],
  exports: [],
})
export class AuthModule {}
