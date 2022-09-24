import { Chat as ChatModel, User as UserModel } from "@prisma/client";
import { IChatCreateDTO } from "./IChat.create.dto";

export interface IChatService {
	findAll(user:UserModel):Promise<ChatModel[]>
	create(user: UserModel, dto: IChatCreateDTO): Promise<ChatModel>;
	delete(chatId: string): Promise<ChatModel>;
}
