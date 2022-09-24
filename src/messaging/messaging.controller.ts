import { Body, Controller, Inject, Param, Post, UseGuards } from "@nestjs/common";
import { ServicesInjectTokens } from "../services.inject.tokens";
import { IMessagingService } from "./interfaces/IMessaging.service";
import { IMessageCreateDTO } from "./interfaces/IMessage.create.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { User } from "../user/decorators/user.decorator";
import {User as UserModel} from "@prisma/client";

@Controller('messages')
export class MessagingController {
	constructor(
		@Inject(ServicesInjectTokens.MessagingService) private readonly messagingService: IMessagingService
	) {}

	@Post("/channels/:channelId")
	@UseGuards(JwtAuthGuard)
	async sendMessage(@User() user:UserModel, @Param("channelId") channelId:string, @Body() messageDto:IMessageCreateDTO){
		console.log(channelId);
		return await this.messagingService.create(user, channelId, messageDto);

	}
}
