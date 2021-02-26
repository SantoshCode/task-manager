import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/authCredentialsdto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(authCredentialsDto: AuthCredentialsDto) {
    return this.userRepository.singUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; userId: string }> {
    const userId = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    const payload: JwtPayload = { userId: `${userId}` };
    const accessToken = this.jwtService.sign(payload);

    this.logger.debug(
      `Generating JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken, userId: `${userId}` };
  }
}
