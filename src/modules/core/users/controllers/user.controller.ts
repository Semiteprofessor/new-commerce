import { Controller, Get } from '@nestjs/common';
import { UserService } from '../services/user.service';

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
}
