import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserStatus } from 'src/modules/common/enums/role.enum';
import { ErpnextQueueService } from '../../queue/erpnext-queue.service';
import { AppEvents } from 'src/modules/common/app.events';
// import { BusinessService } from '../../business/business.service';
// import { Business } from '../../business/business.entity';

//
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly erpNextQueueService: ErpnextQueueService,
  ) {}

  //
  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  //
  //   async delete(id) {
  //     return await this.userRepository.delete(id);
  //   }
  //
  async me(id: string): Promise<any> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new BadRequestException('(User not found)');
    }
    return user;
  }

  async createWalletForAllExistingUsers() {
    const users = await this.userRepository.find({});
    for (const user of users) {
      this.eventEmitter.emit(AppEvents.CREATE_WALLET, {
        user,
      });
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: Partial<SignupDto>,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.userRepository.findOne({
        email: updateUserDto.email,
      });
      if (emailExists) {
        throw new ConflictException(
          `Account with email address ${updateUserDto.email} already exists`,
        );
      }
    }

    // if (updateUserDto.password) {
    //   updateUserDto.password = await this.hashingService.hash(updateUserDto.password);
    // }

    await this.userRepository.update(userId, updateUserDto);
    return this.userRepository.findOne({ id: userId });
  }

  async subscribeOrUnsubscribeToNewsletter(
    userId: string,
    data: SubscribeToNewsletterDto,
  ): Promise<User> {
    await this.erpNextQueueService.enqueueNewsLetterSubscription(data);
    return await this.userRepository.findOneAndUpdate(
      { id: userId },
      {
        subscribedToNewsletter: data.status,
        newsLetterMail: data.email,
      },
    );
  }
  async ActivateOrDeactivateMerchant(data) {
    const { merchant_id, status } = data;
    let newStatus =
      status.toLowerCase() == 'deactivated'
        ? UserStatus.INACTIVE
        : UserStatus.ACTIVE;
    let isActivated = status.toLowerCase() == 'deactivated' ? false : true;
    const merchant = await this.userRepository.findOne({ id: merchant_id });
    if (!merchant)
      throw new NotFoundException(`No merchant found with id: ${merchant_id}`);
    return await this.userRepository.findOneAndUpdate(
      { id: merchant_id },
      {
        status: newStatus,
        isActivated,
      },
    );
  }
}
//
//   async update(userId: string, data: UpdateUserDto) {
//     const { userType, profilePhoto, companyName, address, phone, phone2, zip, state } = data;
//
//     if ((userType as UserRole) == UserRole.BUSINESS) {
//       await this.businessService.create({
//         name: data.companyName,
//         logo: data.profilePhoto,
//         owner: { id: userId } as User,
//       });
//     }
//
//     return await this.userRepository.findOneAndUpdate(
//       { id: userId },
//       {
//         profilePhoto,
//         address,
//         role: userType,
//         phone,
//         phone2: phone2 ?? null,
//         postalCode: zip,
//         region: state,
//       },
//     );
//   }
//
//   async getMetadata(userId: string): Promise<any> {}
//
//   /**
//    * Admin methods
//    */
//   async getAdminUsers(query: QueryParamsDto): Promise<PaginatedRecordsDto<User> | null> {
//     return this.userRepository.findAll(query);
//   }
//
//   async getAdminCourierUsers() {
//     const defaultQueryParams = new QueryParamsDto();
//     defaultQueryParams.role = 'courier';
//
//     return (await this.userRepository.findAll(defaultQueryParams)).pageInfo.total;
//   }
// }
