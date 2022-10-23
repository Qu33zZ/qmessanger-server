import { Body, Controller, Get, HttpCode, HttpStatus, Put, UseGuards } from "@nestjs/common";
import { IUserService } from "./interfaces/IUser.service";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { User } from "./decorators/user.decorator";
import { User as UserModel } from "@prisma/client";
import { IUserDTO } from "./interfaces/IUser.dto";
import { InjectUserService } from "./decorators/user.service.inject";

@Controller("users")
export class UserController {
	constructor(@InjectUserService private readonly userService: IUserService) {};

	@Get("/@me")
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	async getMe(@User() user:UserModel):Promise<UserModel>{
		return user;
	}

	@Put("/@me")
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	async updateMe(@User() user:UserModel, @Body() updateDto:Partial<IUserDTO>):Promise<UserModel>{
		return await this.userService.edit(user.id, updateDto)
<<<<<<< Updated upstream
	};
=======
	}

	@Get("/:username")
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	async findUser(@Param("username") username:string):Promise<UserModel[]>{
		return await this.userService.lookForUsersByUsername(username);
	}

>>>>>>> Stashed changes
}
