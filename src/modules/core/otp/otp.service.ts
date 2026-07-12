import { BadRequestException, Injectable } from "@nestjs/common";
import { addMinutes } from 'date-fns';
import { OtpRepository } from "./otp.repository";
import { User } from "../users/entities/user.entity";
import { Otps } from "./otp.entity";
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  constructor(private readonly otpRepository: OtpRepository) {}

  async create(data: {
    user: User;
    expiryInMinutes: number;
    otp: string;
  }): Promise<Otps> {
    const expiresAt = addMinutes(new Date(), data.expiryInMinutes);

    return this.otpRepository.create({
      otp: data.otp,
      isUsed: false,
      user: data.user,
      expiry: expiresAt,
    });
  }

  async validate(
    email: string,
    otp: string,
  ): Promise<{ isValid: boolean; otpRecord: Otps }> {
    const otpRecord = await this.otpRepository.findOne(
      {
        user: { email },
        otp,
      },
      {
        relations: {
          user: true,
        },
      },
    );

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }

    if (otpRecord.isUsed) {
      throw new BadRequestException('OTP has already been used');
    }

    if (otpRecord.expiry < new Date()) {
      throw new BadRequestException('OTP is expired');
    }

    otpRecord.isUsed = true;

    await this.otpRepository.findOneAndUpdate(
      {
        id: otpRecord.id,
      },
      {
        isUsed: true,
      },
    );
    return { isValid: true, otpRecord };
  }

  public generateOtp() {
    return crypto.randomInt(100000, 999999).toString();
  }
}