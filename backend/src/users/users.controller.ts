import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';

@Controller('api')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Post('/createProfile')
  @UseInterceptors(FileInterceptor('profileImage'))
  async createProfile(
    @Req() req,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      if (file.size === 0) {
        throw new BadRequestException('Uploaded file is empty');
      }

      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedFileTypes.includes(file.mimetype)) {
        throw new BadRequestException('Invalid file type. Allowed types are .jpeg, .png, .gif');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException('File size exceeds the 5MB limit');
      }

      createProfileDto.profileImage = `uploads/profile-images/${file.filename}`;
    }

    return this.usersService.createProfile(req.user.userId, createProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getProfile')
  async getProfile(@Req() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/updateProfile')
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateProfile(
    @Req() req,
    @Body() updateProfileDto: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      const mimeType = file.mimetype.split('/')[0];
      if (mimeType !== 'image') {
        throw new BadRequestException('File must be an image');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException('File size exceeds 5MB');
      }

      try {
        await sharp(file.buffer).metadata();
      } catch (error) {
        throw new BadRequestException('Invalid image file');
      }

      const fileExtension = path.extname(file.originalname);
      const filename = `${uuidv4()}${fileExtension}`;
      const filePath = path.join('uploads', 'profile-images', filename);

      fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, file.buffer);

      const existingProfile = await this.usersService.getProfileByUserId(req.user.userId);
      if (existingProfile && existingProfile.profileImage) {
        const oldFilePath = path.join('uploads', existingProfile.profileImage);
        if (fs.existsSync(oldFilePath)) {
          await fs.promises.unlink(oldFilePath);
        }
      }

      updateProfileDto.profileImage = `uploads/profile-images/${filename}`;
    }

    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/deleteProfile')
  async deleteProfile(@Req() req) {
    return this.usersService.deleteProfile(req.user.userId);
  }
}
