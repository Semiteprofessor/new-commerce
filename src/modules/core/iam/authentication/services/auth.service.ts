import { UserRepository } from 'src/modules/core/users/repositories/user.repository';
import { HashingService } from './hashing.service';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OtpService } from 'src/modules/core/otp/otp.service';
import { ConfigType } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ErpnextQueueService } from 'src/modules/core/queue/erpnext-queue.service';
import jwtConfig from '../../config/jwt.config';
import { AppEvents, UserEvents } from 'src/modules/common/app.events';
import { User } from 'src/modules/core/users/entities/user.entity';
import {
  ChangePasswordDto,
  ResendOTPDto,
  ResetPassword,
  SignIn,
  SignupDto,
  UpdatePassword,
  VerifyOtpDto,
} from '../dtos/auth.dto';
import { randomUUID } from 'crypto';
import { UserStatus } from 'src/modules/common/enums/role.enum';
import { BusinessProfile } from 'src/modules/apps/shop/merchants/entities/business-profile.entity';
import { RefreshTokenDto } from '../dtos/refresh-token-dto';
import { StringValue } from 'ms';
import {
  InvalidateRefreshTokenError,
  RefreshTokenIdsStorage,
} from '../refresh-token-ids.storage';
import { BusinessProfileRepository } from 'src/modules/apps/shop/merchants/repositories/business-profile.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly userRepository: UserRepository,
    private readonly businessRepository: BusinessProfileRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly otpService: OtpService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly eventEmitter: EventEmitter2,
    private readonly erpQueueService: ErpnextQueueService,
  ) {}

  async signUp(signUpDto: SignupDto) {
    const { email, password, firstName, lastName, role } = signUpDto;
    const emailExists = await this.userRepository.findOne({ email, role });

    if (emailExists) {
      throw new ConflictException(
        `Account with email address ${email} already exists`,
      );
    }

    const hashedPassword = await this.hashingService.hash(password);

    const _newUser: Partial<User> = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      status: UserStatus.PENDING,
      role,
    };

    const newUser = await this.userRepository.create(_newUser);

    let newBusiness: BusinessProfile;

    if (role === 'merchant') {
      newBusiness = await this.businessRepository.create({
        name: signUpDto.businessName,
        address: signUpDto.businessAddress,
        phone: signUpDto.phone,
        email: signUpDto.email,
        businessType: signUpDto.business_type,
        businessCategory: signUpDto.business_category,
        businessSection: signUpDto.business_section,
        businessLocationLat: signUpDto.businessLocationLat,
        businessLocationLong: signUpDto.businessLocationLong,
        accountName: signUpDto.accountName,
        accountNumber: signUpDto.accountNumber,
        bankCode: signUpDto.bankCode,
        bankName: signUpDto.bankName,
        document: signUpDto.businessDocument,
        owner: { id: newUser.id } as User,
      });
    }

    await this.sendOTP(
      newUser,
      'otp',
      ' To complete the signup process, please use the verification code below to confirm your account.',
      'OTP Verification',
    );

    if (role === 'merchant') {
      await this.erpQueueService.enqueueCreateErpNextMerchant(
        newUser,
        newBusiness,
      );
    } else {
      await this.erpQueueService.enqueueCreateErpNextUser(newUser);
    }

    this.eventEmitter.emit(AppEvents.CREATE_WALLET, {
      user: newUser,
    });

    return newUser;
  }

  async verifyOtp(data: VerifyOtpDto): Promise<any> {
    const { email, otp } = data;
    const validationResponse = await this.otpService.validate(email, otp);

    if (validationResponse.isValid) {
      const user = await this.userRepository.findOneAndUpdate(
        { id: validationResponse.otpRecord.user.id },
        { emailVerified: true },
      );

      this.eventEmitter.emit(UserEvents.SEND_WELCOME_MAIL, user);
      return { message: 'OTP Verified successfully' };
    }
  }

  async resendOTP(data: ResendOTPDto) {
    const user = await this.userRepository.findOne({ email: data.email });
    if (!user) {
      throw new NotFoundException(' User not found');
    }

    await this.sendOTP(
      user,
      'otp',
      ' To complete the signup process, please use the verification code below to confirm your account.',
      'OTP Verification',
    );

    return { message: `OTP sent to ${user.email}` };
  }

  private async sendOTP(
    user: User,
    template: string,
    message: string,
    subject: string,
  ) {
    const { id, email, firstName } = user;

    const otpCode = this.otpService.generateOtp();

    await this.otpService.create({ user, expiryInMinutes: 20, otp: otpCode });

    this.eventEmitter.emit(UserEvents.SEND_OTP_EMAIL, {
      email,
      title: firstName,
      message,
      otp: otpCode,
      subject,
    });
  }

  async signIn(signinDto: SignIn) {
    const user = await this.userRepository.findOne(
      {
        email: signinDto.email,
        role: signinDto.role,
      },
      {
        select: {
          id: true,
          email: true,
          role: true,
          password: true,
          emailVerified: true,
          username: true,
          countryCode: true,
        },
      },
    );

    if (!user) {
      throw new UnauthorizedException('Account does not exist');
    }

    const isPasswordMatch = await this.hashingService.compare(
      signinDto.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid Password');
    }

    if (!user.emailVerified) {
      throw new BadRequestException('Email not verified');
    }

    if (user.isBanned) {
      throw new ForbiddenException('Your account has been banned');
    }
    delete user.password;

    const tokens = await this.generateTokens(user);
    // console.log(tokens);
    console.log(this.jwtConfiguration);
    const decoded = this.jwtService.decode(tokens.accessToken);

    return {
      user,
      tokens,
      expiresIn: decoded['exp'],
    };
  }

  public async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(user.id, this.jwtConfiguration.accessTokenTtl, {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);

    // await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
    return { accessToken, refreshToken };
  }

  async googleAuthenticateUser(data: any) {
    const {
      _json: { email, sub: id, given_name, family_name, picture },
    } = data;

    const [existingUserByEmail, existingUserByGoogleId] = await Promise.all([
      this.userRepository.findOne({ email: email }),
      this.userRepository.findOne({ googleId: id }),
    ]);

    if (existingUserByEmail || existingUserByGoogleId) {
      return await this.generateTokens(existingUserByGoogleId);
    }

    const _newUser: Partial<User> = {
      firstName: given_name,
      lastName: family_name,
      email,
      password: null,
      status: UserStatus.ACTIVE,
      googleId: id,
      emailVerified: true,
      isActivated: true,
    };

    const newUser = await this.userRepository.create(_newUser);

    this.eventEmitter.emit(UserEvents.SEND_WELCOME_MAIL, newUser);

    return await this.generateTokens(newUser);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<any, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
      });

      const user = await this.userRepository.findOne({ id: sub });

      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );

      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }

      return this.generateTokens(user);
    } catch (err) {
      if (err instanceof InvalidateRefreshTokenError) {
        throw new UnauthorizedException('Access Denied');
      }
      throw new UnauthorizedException(err);
    }
  }
  private async signToken<T extends object>(
    userId: string,
    expiresIn: StringValue | number,
    payload?: T,
  ) {
    console.log('expiresIn received:', expiresIn);

    const token = await this.jwtService.signAsync(
      {
        sub: userId,
        ...(payload ?? {}),
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );

    console.log('decoded token:', this.jwtService.decode(token));

    return token;
  }
  
  async resetPassword(data: ResetPassword) {
    const { email, mobile } = data;
    const user = await this.userRepository.findOne({ email });

    if (!user) return { message: 'password reset mail sent' };

    if (mobile) {
      await this.sendOTP(
        user,
        'otp',
        'Use the code to reset your password',
        'Reset Password OTP',
      );
    } else {
      const resetToken = this.jwtService.sign(
        { userEmail: user.email },
        { expiresIn: '20 minutes' },
      );
      this.eventEmitter.emit(UserEvents.SEND_PASSWORD_RESET_MAIL, {
        email,
        resetToken,
        firstName: user.firstName,
      });
    }

    return { message: 'password reset mail sent' };
  }

  async updatePassword(data: UpdatePassword) {
    const { email, password, otp } = data;
    if (!password) throw new BadRequestException('Password is required');

    const user = await this.userRepository.findOne({ email });
    if (!user)
      throw new BadRequestException('User with this email does not exist');

    const validationResponse = await this.otpService.validate(email, otp);
    if (validationResponse.isValid) {
      const hashedPassword = await this.hashingService.hash(password);

      await this.userRepository.findOneAndUpdate(
        { id: user.id },
        { password: hashedPassword },
      );
    }
    return { message: 'Password updated successfully' };
  }

  async changePassword(userId: string, data: ChangePasswordDto) {
    const { oldPassword, newPassword } = data;

    const user = await this.userRepository.findOne(
      { id: userId },
      {
        select: {
          id: true,
          password: true,
        },
      },
    );

    const isOldPasswordValid = await this.hashingService.compare(
      oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new Error('Old password is incorrect');
    }

    const hashedPassword = await this.hashingService.hash(newPassword);

    await this.userRepository.findOneAndUpdate(
      { id: user.id },
      { password: hashedPassword },
    );

    return { message: 'Password updated successfully' };
  }
}
