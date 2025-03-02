import { Injectable, NotFoundException, ConflictException, HttpStatus, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { User, UserDocument } from '../auth/schemas/user.schema'
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getHoroscope, getZodiacSign } from '../utils/zodiac_util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }


  async createUser(email: string, username: string, password: string): Promise<UserDocument> {
    const existingEmail = await this.userModel.findOne({ email }).exec();
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }
  
    const existingUsername = await this.userModel.findOne({ username }).exec();
    if (existingUsername) {
      throw new ConflictException('Username already in use');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new this.userModel({ email, username, password: hashedPassword });
    const savedUser = await newUser.save();
    return savedUser;
 
  }
  
  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async createProfile(userId: string, createProfileDto: CreateProfileDto, profileImage?: Express.Multer.File): Promise<ProfileDocument> {
    const existingUser = await this.userModel.findOne({ $or: [{ username: createProfileDto.displayName }] }).exec();
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
  
    const existingProfile = await this.profileModel.findOne({ userId }).exec();
    if (existingProfile) {
      throw new ConflictException('Profile already exists');
    }

    if (createProfileDto.birthday) {
      const zodiacSign = getZodiacSign(createProfileDto.birthday);
      const horoscope = getHoroscope(zodiacSign);
      createProfileDto.zodiacSign = zodiacSign;
      createProfileDto.horoscope = horoscope;
    }
  
    if (profileImage) {
      const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.gif'];
      const fileExtension = path.extname(profileImage.originalname).toLowerCase();
      if (!allowedFileTypes.includes(fileExtension)) {
        throw new BadRequestException('Invalid file type. Allowed types are .jpg, .jpeg, .png, .gif');
      }
  
      if (profileImage.size > 5 * 1024 * 1024) {
        throw new BadRequestException('File size exceeds the 5MB limit');
      }
  
      const filename = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(__dirname, '..', 'uploads', 'profile-images', filename);
      const dir = path.dirname(filePath);
  
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
  
      try {
        fs.writeFileSync(filePath, profileImage.buffer);
        createProfileDto.profileImage = filePath;
      } catch (error) {
        throw new Error('Error saving the profile image: ' + error.message);
      }
    }
  
    const newProfile = new this.profileModel({ userId, ...createProfileDto });
    return newProfile.save();
  }

  async getProfile(userId: string): Promise<ProfileDocument> {
    const profile = await this.profileModel.findOne({ userId }).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: CreateProfileDto): Promise<ProfileDocument> {
    const existingProfile = await this.profileModel.findOne({ userId }).exec();
    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }

    if (updateProfileDto.displayName) {
      const displayNameConflict = await this.profileModel.findOne({
        displayName: updateProfileDto.displayName,
        userId: { $ne: userId },
      }).exec();
      if (displayNameConflict) {
        throw new ConflictException('Display name already exists');
      }
    }

    if (updateProfileDto.birthday) {
      const zodiacSign = getZodiacSign(updateProfileDto.birthday);
      const horoscope = getHoroscope(zodiacSign);
  
      updateProfileDto.zodiacSign = zodiacSign;
      updateProfileDto.horoscope = horoscope;
    }

    Object.assign(existingProfile, updateProfileDto);
    return existingProfile.save();
  }

  async deleteProfile(currentUserId: string): Promise<any> {
    const deletedProfile = await this.profileModel.findOneAndDelete({ userId: currentUserId }).exec();

    if (!deletedProfile) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Profile not found',
      });
    }

    const deletedUser = await this.userModel.findByIdAndDelete(currentUserId).exec();

    if (!deletedUser) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Profile and user deleted successfully',
    };
  }

  async getProfileByUserId(userId: string): Promise<ProfileDocument> {
    const profile = await this.profileModel.findOne({ userId }).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

}
