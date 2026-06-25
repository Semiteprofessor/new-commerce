import { Controller } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('v1')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
