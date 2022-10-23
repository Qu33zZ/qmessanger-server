import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { Chat as ChatModel, User as UserModel } from "@prisma/client";
import { IChatService } from "./interfaces/IChatService";
import { IChatCreateDTO } from "./interfaces/IChat.create.dto";
import { User } from "../user/decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { InjectChatService } from "./decotators/chat.service.inject";

@Controller("chats")
export class ChatController {
	constructor(@InjectChatService private readonly chatService: IChatService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	async getAllChats(@User() user:UserModel): Promise<ChatModel[]> {
		return await this.chatService.findAll(user);
	}

	@Post("/")
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard)
	async create(@User() user: UserModel, @Body() dto: IChatCreateDTO): Promise<ChatModel> {
		return await this.chatService.create(user, dto);
	}

	@Delete("/:id")
	async delete(@Param(":id") chatId: string): Promise<ChatModel> {
		return await this.chatService.delete(chatId);
	}
}
