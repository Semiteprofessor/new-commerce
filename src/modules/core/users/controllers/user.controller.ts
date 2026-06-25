import { Controller } from "@nestjs/common";

@Controller("v1")
export class UserController {
    constructor(private readonly userService: UserService) {

    }
}