import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ResendOTPDto,
  ResetPassword,
  SignIn,
  SignupDto,
  VerifyOtpDto,
} from '../dtos/auth.dto';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { AuthType } from '../enums/auth-type.enum';
import { Auth } from '../decorator/auth.decorator';
import { RefreshTokenDto } from '../dtos/refresh-token-dto';

@ApiTags('Authentication')
@Auth(AuthType.None)
@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User successfully signed up.' })
  @ApiResponse({ status: 400, description: 'Invalid request data.' })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signUp(signupDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({ status: 200, description: 'User successfully signed in.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({
    description: 'Login credentials',
    schema: {
      example: {
        email: 'semiteprofessor@gmail.com',
        password: 'easytoremember',
      },
    },
  })
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignIn,
  ) {
    return await this.authService.signIn(signInDto);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP to the user' })
  @ApiResponse({ status: 200, description: 'OTP resent successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request data.' })
  async resend(@Body() data: ResendOTPDto) {
    return this.authService.resendOTP(data);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for user' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or expired.' })
  async verifyOTP(@Body() data: VerifyOtpDto) {
    return this.authService.verifyOtp(data);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token.',
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request data.' })
  async resetPassword(@Body() data: ResetPassword) {
    return this.authService.resetPassword(data);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth' })
  @ApiResponse({ status: 302, description: 'Redirected to Google OAuth.' })
  async googleSignUp() {}
}
