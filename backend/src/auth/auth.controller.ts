import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
 

@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private jwtService: JwtService
  ) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.usersService.createUser(registerDto.email, registerDto.username, registerDto.password);
    const access_token = await this.jwtService.sign({ userId: user.id, username: user.username });
    return {
      user,
      access_token: access_token,
    };
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }
}
