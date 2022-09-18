import { Controller, Inject } from "@nestjs/common";
import { UserService } from './user.service';
import { IUserService } from "./interfaces/IUser.service";

@Controller('user')
export class UserController {
	constructor(@Inject(UserService) private readonly userService: IUserService) {}
}
