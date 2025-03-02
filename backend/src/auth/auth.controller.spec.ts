import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockUsersService = {
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('register', () => {
    it('should successfully register a user and return a user and access token', async () => {
      const registerDto: RegisterDto = {
        email: 'user@example.com',
        username: 'johndoe',
        password: 'Password123!',
      };

      const mockUser = {
        id: '123',
        email: 'user@example.com',
        username: 'johndoe',
      };

      const mockAccessToken = { access_token: 'mockAccessToken' };

      mockUsersService.createUser = jest.fn().mockResolvedValue(mockUser);
      mockAuthService.login = jest.fn().mockResolvedValue(mockAccessToken);

      const result = await authController.register(registerDto);

      expect(result).toEqual({
        user: mockUser,
        access_token: mockAccessToken.access_token,
      });
      expect(mockUsersService.createUser).toHaveBeenCalledWith(registerDto.email, registerDto.username, registerDto.password);
      expect(mockAuthService.login).toHaveBeenCalledWith(registerDto.username, registerDto.password);
    });

    it('should throw an error if user creation fails', async () => {
      const registerDto: RegisterDto = {
        email: 'user@example.com',
        username: 'johndoe',
        password: 'Password123!',
      };

      mockUsersService.createUser = jest.fn().mockRejectedValue(new Error('User creation failed'));

      await expect(authController.register(registerDto)).rejects.toThrowError('User creation failed');
    });
  });

  describe('login', () => {
    it('should successfully log in a user and return an access token', async () => {
      const loginDto: LoginDto = {
        username: 'johndoe',
        password: 'Password123!',
      };

      const mockAccessToken = { access_token: 'mockAccessToken' };

      mockAuthService.login = jest.fn().mockResolvedValue(mockAccessToken);

      const result = await authController.login(loginDto);

      expect(result).toEqual(mockAccessToken);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto.username, loginDto.password);
    });

    it('should throw an error if login fails', async () => {
      const loginDto: LoginDto = {
        username: 'johndoe',
        password: 'Password123!',
      };

      mockAuthService.login = jest.fn().mockRejectedValue(new Error('Invalid credentials'));

      await expect(authController.login(loginDto)).rejects.toThrowError('Invalid credentials');
    });
  });
});
