import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailService } from 'src/common/services/email.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PasswordReset])],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  exports: [],
})
export class AuthModule {}
