import { Chat as ChatModel} from "@prisma/client";
import { IChatCreateDTO } from "./IChat.create.dto";

export interface IChatService{
	create(dto:IChatCreateDTO):Promise<ChatModel>;
	delete(chatId:string):Promise<ChatModel>;
}