import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { IMessagingService } from "./interfaces/IMessaging.service";
import { IMessageCreateDTO } from "./interfaces/IMessage.create.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { User } from "../user/decorators/user.decorator";
import { User as UserModel } from "@prisma/client";
import { InjectMessagingService } from "./decotators/chat.service.inject";

@Controller('messages')
export class MessagingController {
	constructor(
		@InjectMessagingService private readonly messagingService: IMessagingService
	) {}

	@Post("/channels/:channelId")
	@UseGuards(JwtAuthGuard)
	async sendMessage(@User() user:UserModel, @Param("channelId") channelId:string, @Body() messageDto:IMessageCreateDTO){
		return await this.messagingService.create(user, channelId, messageDto);
	}

	@Get("/channels/:channelId")
	@UseGuards(JwtAuthGuard)
	async getMessages(@User() user:UserModel, @Param("channelId") channelId:string){
		return await this.messagingService.findAll(user, channelId);
	}


	@Put("/:messageId")
	@UseGuards(JwtAuthGuard)
	async editMessage(@User() user:UserModel, @Param("messageId") messageId:string, @Body() messageDto:Partial<IMessageCreateDTO>){
		return await this.messagingService.update(user.id, messageId, messageDto);
	}

	@Delete("/:messageId")
	@UseGuards(JwtAuthGuard)
	async deleteMessage(@User() user:UserModel, @Param("messageId") messageId:string){
		return await this.messagingService.delete(user.id, messageId);
	}
}
