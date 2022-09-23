import { Controller, Inject } from "@nestjs/common";
import { ChatService } from './chat.service';
import { IChatService } from "./interfaces/IChatService";
import {Chat as ChatModel} from "@prisma/client";
import { IChatCreateDTO } from "./interfaces/IChat.create.dto";
import { ServicesInjectTokens } from "../services.inject.tokens";

@Controller('chat')
export class ChatController implements IChatService{
	constructor(@Inject(ServicesInjectTokens.ChatService) private readonly chatService: IChatService) {}

	async create(dto:IChatCreateDTO):Promise<ChatModel> {
		return;
	}

	async delete(chatId:string):Promise<ChatModel>{
		return;
	}

}
