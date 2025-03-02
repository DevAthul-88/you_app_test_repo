import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @MinLength(6)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
  password: string;
}
