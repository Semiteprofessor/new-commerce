import { Body, Controller, Get, Patch, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ActiveUser } from '../../iam/decorators/active-user.decorator';
import { SubscribeToNewsletterDto, UpdateUserInfoDto } from '../../iam/authentication/dtos/auth.dto';
import { ActorUser } from 'src/modules/common/types/user.types';
import { User } from '../entities/user.entity';

@Controller('v1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users/me')
  async me(@ActiveUser('id') authUserId: any): Promise<Partial<User>> {
    return this.userService.me(authUserId);
  }
  //
  // @Patch('users/:id')
  // async update(
  //   @ActiveUser() authUserData: User,
  //   @Param('id') userId: string,
  //   @Body() data: UpdateUserDto,
  // ) {
  //   const { id: _id, role } = authUserData;
  //   if (_id !== userId) {
  //     throw new BadRequestException('Profile not found');
  //   }
  //   return this.userService.update(userId, data);
  // }

  @Patch('users/update')
  @ApiOperation({ summary: 'Update user information' })
  @ApiResponse({
    status: 200,
    description: 'User information updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request data.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  async updateUser(
    @ActiveUser() user: ActorUser,
    @Body() updateUserDto: UpdateUserInfoDto,
  ) {
    console.log('ActiveUser:', user);
    if (!user || !user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userService.updateUser(user.id, updateUserDto);
  }

  @ApiBearerAuth()
  @Patch('users/newsletter/subscribe')
  @ApiOperation({ summary: 'subscribe to newsletter' })
  async subscribeOrUnsubscribeToNewsletter(
    @ActiveUser() user: ActorUser,
    @Body() data: SubscribeToNewsletterDto,
  ) {
    return this.userService.subscribeOrUnsubscribeToNewsletter(user.id, data);
  }
}
