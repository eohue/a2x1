import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.isApproved) throw new UnauthorizedException('Not approved');
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(data: { email: string; password: string; name: string; phone?: string }) {
    const exists = await this.userService.findByEmail(data.email);
    if (exists) throw new BadRequestException('Email already exists');
    const hash = await bcrypt.hash(data.password, 10);
    return this.userService.create({ ...data, password: hash });
  }

  async approveUser(userId: string) {
    return this.userService.approve(userId);
  }
} 