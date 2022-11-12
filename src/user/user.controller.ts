import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { IUserService } from "./interfaces/IUser.service";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { User } from "./decorators/user.decorator";
import { User as UserModel } from "@prisma/client";
import { IUserDTO } from "./interfaces/IUser.dto";
import { InjectUserService } from "./decorators/user.service.inject";
import { FileInterceptor } from "@nestjs/platform-express";

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
	@UseInterceptors(FileInterceptor('avatar'))
	async updateMe(@User() user:UserModel, @Body() updateDto:Partial<IUserDTO>, @UploadedFile() avatar:Express.Multer.File):Promise<UserModel>{
		if(avatar){
			updateDto.avatar = avatar.filename;
		}
		return await this.userService.edit(user, updateDto)
	};

	@Get("/:username")
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	async findUser(@User() user:UserModel, @Param("username") username:string):Promise<UserModel[]>{
		return await this.userService.lookForUsersByUsername(user, username);
	}
  
}
