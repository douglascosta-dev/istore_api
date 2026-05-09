import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { CreateUserToken } from '../dtos/create-user-token.dto';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secretKey: string | undefined = process.env.JWT_ACCESS;
    if (!secretKey)
      throw new HttpException('Erro ao validar Token', HttpStatus.UNAUTHORIZED);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  validate(payload: CreateUserToken) {
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
