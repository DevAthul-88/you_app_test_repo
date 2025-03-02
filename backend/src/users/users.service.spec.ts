import { ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import * as zodiacUtil from '../utils/zodiac_util';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

jest.mock('../utils/zodiac_util', () => ({
  getZodiacSign: jest.fn(),
  getHoroscope: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let mockProfileModel;
  let mockUserModel;

  beforeEach(() => {

    class MockModel {
      constructor(private data: any) {
        this.save = jest.fn().mockResolvedValue(data);
      }

      save: jest.Mock;

      static findOne = jest.fn().mockReturnValue({
        exec: jest.fn(),
      });

      static findById = jest.fn().mockReturnValue({
        exec: jest.fn(),
      });

      static findByIdAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn(),
      });

      static findOneAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn(),
      });
    }

    mockUserModel = MockModel;
    mockProfileModel = MockModel;

    service = new UsersService(mockProfileModel, mockUserModel);

    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      mockUserModel.findOne().exec.mockResolvedValueOnce(null);
      mockUserModel.findOne().exec.mockResolvedValueOnce(null);

      const newUser = {
        email: 'newemail@example.com',
        username: 'newuser',
        password: hashedPassword,
      };

      mockUserModel.prototype.save = jest.fn().mockResolvedValue(newUser);

      const result = await service.createUser('newemail@example.com', 'newuser', 'password');
      expect(result).toEqual(newUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    });
  });

  describe('createProfile', () => {
    it('should create a new profile with birthday and zodiac info', async () => {
      const profileData = {
        displayName: 'newProfile',
        gender: 'Male',
        birthday: new Date('1990-01-01'),
      };

      mockUserModel.findOne().exec.mockResolvedValueOnce(null);
      mockProfileModel.findOne().exec.mockResolvedValueOnce(null);

      (zodiacUtil.getZodiacSign as jest.Mock).mockReturnValue('Capricorn');
      (zodiacUtil.getHoroscope as jest.Mock).mockReturnValue('Your horoscope');

      const expectedProfile = {
        ...profileData,
        zodiacSign: 'Capricorn',
        horoscope: 'Your horoscope',
        userId: 'userId',
      };

      mockProfileModel.prototype.save = jest.fn().mockResolvedValue(expectedProfile);

      const result = await service.createProfile('userId', profileData as any, undefined);
      expect(result).toEqual(expectedProfile);
      expect(zodiacUtil.getZodiacSign).toHaveBeenCalledWith(profileData.birthday);
      expect(zodiacUtil.getHoroscope).toHaveBeenCalledWith('Capricorn');
    });
  });
});