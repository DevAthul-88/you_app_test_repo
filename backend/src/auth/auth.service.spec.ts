import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user data if credentials are valid', async () => {
      const username = 'johndoe';
      const password = 'Password123';
      const user = { username: 'johndoe', _id: '123', password: 'hashedPassword' };

      mockUsersService.findByUsername.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(username, password);

      expect(result).toEqual({ username: 'johndoe', id: '123' });
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const username = 'johndoe';
      const password = 'WrongPassword';
      const user = { username: 'johndoe', _id: '123', password: 'hashedPassword' };

      mockUsersService.findByUsername.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.validateUser(username, password)).rejects.toThrow(UnauthorizedException);
      await expect(authService.validateUser(username, password)).rejects.toThrowError('Invalid credentials');
    });
  });

  describe('login', () => {
    it('should return an access token if login is successful', async () => {
      const username = 'johndoe';
      const password = 'Password123';
      const user = { username: 'johndoe', _id: '123', password: 'hashedPassword' };
      const mockAccessToken = 'mockAccessToken';

      mockUsersService.findByUsername.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(mockAccessToken);

      const result = await authService.login(username, password);

      expect(result).toEqual({ access_token: mockAccessToken });
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ userId: user._id, username: user.username });
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const username = 'johndoe';
      const password = 'WrongPassword';

      mockUsersService.findByUsername.mockResolvedValue(null);

      await expect(authService.login(username, password)).rejects.toThrow(UnauthorizedException);
      await expect(authService.login(username, password)).rejects.toThrowError('Invalid credentials');
    });
  });
});