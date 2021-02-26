import { UnauthorizedException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/authCredentialsdto';
import { UserEntity } from './user.entity';

import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async singUp(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;
    const user = new UserEntity();
    user.username = username;

    const salt = await bcrypt.genSalt();
    user.salt = salt;
    user.password = await bcrypt.hash(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Username already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;

    const user = await this.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const hashedPassword = await bcrypt.hash(password, user.salt);

    if (user && user.password === hashedPassword) {
      return user.id;
    } else {
      return null;
    }
  }
}
