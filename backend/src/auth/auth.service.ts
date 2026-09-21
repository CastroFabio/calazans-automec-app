import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const userCopy = { ...user };
    delete (userCopy as { password_hash?: string }).password_hash;
    return userCopy;
  }

  async generateTokens(userId: number, email: string) {
    // Define o payload base sem exp/iat
    const getPayload = () => ({ userId, email, sub: userId });

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(getPayload(), {
        secret:
          this.configService.get<string>('JWT_SECRET') || 'defaultSecretKey',
        expiresIn: (this.configService.get<string>('JWT_EXPIRES_IN') ||
          '15m') as any,
      }),
      this.jwtService.signAsync(getPayload(), {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          'defaultRefreshSecret',
        expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ||
          '7d') as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: number, email: string) {
    return this.generateTokens(userId, email);
  }
}
