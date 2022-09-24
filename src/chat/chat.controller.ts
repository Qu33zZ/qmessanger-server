import { Body, Controller, Delete, Get, Inject, Param, Post, UseGuards } from "@nestjs/common";
import { User as UserModel } from "@prisma/client";
import { IChatService } from "./interfaces/IChatService";
import { Chat as ChatModel } from "@prisma/client";
import { IChatCreateDTO } from "./interfaces/IChat.create.dto";
import { ServicesInjectTokens } from "../services.inject.tokens";
import { User } from "../user/decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";

@Controller("chats")
export class ChatController {
	constructor(@Inject(ServicesInjectTokens.ChatService) private readonly chatService: IChatService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	async getAllChats(@User() user:UserModel): Promise<ChatModel[]> {
		return await this.chatService.findAll(user);
	}

	@Post("/")
	@UseGuards(JwtAuthGuard)
	async create(@User() user: UserModel, @Body() dto: IChatCreateDTO): Promise<ChatModel> {
		return await this.chatService.create(user, dto);
	}

	@Delete("/:id")
	async delete(@Param(":id") chatId: string): Promise<ChatModel> {
		return await this.chatService.delete(chatId);
	}
}
