import { Injectable } from '@nestjs/common';
import { ThirdPartyDto } from '../dto/third-party.dto';
import { ThirdParty } from '../entities/third-party.entity';
import { ThirdPartyRepository } from '../repositories/third-party.repository';
import { UserEvents } from 'src/modules/common/app.events';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ThirdPartyService {
  constructor(
    private readonly thirdPartyRepository: ThirdPartyRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async transferThirdParty(
    userId: string,
    thirdPartyDto: ThirdPartyDto,
  ): Promise<ThirdParty> {
    const { imei, name, email } = thirdPartyDto;

    const warranty = await this.thirdPartyRepository.create({
      imei,
      name,
      email,
    });

    await this.transferWarranty(
      warranty,
      'Your warranty claim has been successfully received. Our team will review your submission and claim then get back to you if possible.',
      'Warranty Claim',
    );

    await this.thirdPartyRepository.save(warranty);
    return warranty;
  }

  private async transferWarranty(
    data: ThirdParty,
    message: string,
    subject: string,
  ) {
    const { imei, name, email } = data;

    await this.thirdPartyRepository.create({ imei, name, email });

    this.eventEmitter.emit(UserEvents.SEND_WARRANTY_EMAIL, {
      email,
      title: name,
      message,
      subject,
    });
  }
}
