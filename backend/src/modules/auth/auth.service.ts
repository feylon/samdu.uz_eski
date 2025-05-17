import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthUser, JwtPayload } from '../../common/interfaces/auth-user.interface';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user || !user.isActive || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }
    await this.usersService.touchLastLogin(user.id);
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      tokenType: 'Bearer',
      expiresIn: this.config.getOrThrow<string>('jwt.expiresIn'),
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    };
  }

  async changePassword(authUser: AuthUser, dto: ChangePasswordDto): Promise<void> {
    const user = await this.usersService.findByEmailWithPassword(authUser.email);
    if (!user || !(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new BadRequestException('Joriy parol noto\'g\'ri');
    }
    await this.usersService.update(user.id, { password: dto.newPassword });
  }
}
