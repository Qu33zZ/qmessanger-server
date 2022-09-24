import {Message as MessageModel, User as UserModel} from '@prisma/client';
import { IMessageCreateDTO } from "./IMessage.create.dto";

export interface IMessagingService{
	create(user:UserModel, channelId:string, message:IMessageCreateDTO):Promise<MessageModel>;
}