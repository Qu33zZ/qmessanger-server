import {Message as MessageModel, User as UserModel, Chat as ChatModel} from '@prisma/client';
import { IMessageCreateDTO } from "./IMessage.create.dto";

export interface IMessagingService{
	create(user:UserModel, channelId:string, message:IMessageCreateDTO):Promise<MessageModel>;
	findAll(user:UserModel, chatId:string):Promise<(MessageModel & {author: UserModel, chat: ChatModel})[]>;
	update(userId:string, messageId:string, message:Partial<IMessageCreateDTO> ):Promise<MessageModel>;
	delete(userId:string, messageId:string):Promise<void>;
}