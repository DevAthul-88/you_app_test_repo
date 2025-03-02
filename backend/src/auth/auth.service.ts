import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { username: user.username, id: user._id };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    return { access_token: this.jwtService.sign({ userId: user.id, username: user.username }) };
  }
}
