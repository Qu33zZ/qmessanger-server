import { Body, Controller, Inject, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { IUserService } from "./interfaces/IUser.service";
import { ServicesInjectTokens } from "../services.inject.tokens";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { User } from "./decorators/user.decorator";
import {User as UserModel} from "@prisma/client";
import { IUserDTO } from "./interfaces/IUser.dto";

@Controller("user")
export class UserController {
	constructor(@Inject(ServicesInjectTokens.UserService) private readonly userService: IUserService) {};

	@Put("/@me")
	@UseGuards(JwtAuthGuard)
	async updateMe(@User() user:UserModel, @Body() updateDto:Partial<IUserDTO>):Promise<UserModel>{
		return await this.userService.edit(user.id, updateDto)
	};
}
