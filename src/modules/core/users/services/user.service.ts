import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
    // private readonly erpNextQueueService: ErpnextQueueService,
  ) {}

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
}
