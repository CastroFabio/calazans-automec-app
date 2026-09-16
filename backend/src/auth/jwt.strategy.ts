// src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'defaultSecretKey',
    });
  }

  async validate(payload: { userId: number }) {
    const id = payload.userId;

    if (!id) {
      throw new UnauthorizedException('Token inválido');
    }

    const user = await this.userService.findOne(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
