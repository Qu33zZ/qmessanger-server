import { Controller, Inject } from "@nestjs/common";
import { UserService } from "./user.service";
import { IUserService } from "./interfaces/IUser.service";
import { ServicesInjectTokens } from "../services.inject.tokens";

@Controller("user")
export class UserController {
	constructor(@Inject(ServicesInjectTokens.UserService) private readonly userService: IUserService) {}
}
