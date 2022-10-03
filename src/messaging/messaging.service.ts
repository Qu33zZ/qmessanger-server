import { BadRequestException, ForbiddenException, Inject, Injectable, Provider } from "@nestjs/common";
import { IMessagingService } from "./interfaces/IMessaging.service";
import { ServicesInjectTokens } from "../services.inject.tokens";
import {Message as MessageModel, User as UserModel, Chat as ChatModel} from "@prisma/client";
import { IMessageCreateDTO } from "./interfaces/IMessage.create.dto";
import { PrismaService } from "../prisma/prisma.service";
import { SocketGatewaysGateway } from "../socket-gateways/socket-gateways.gateway";

@Injectable()
export class MessagingService implements IMessagingService {
	constructor(private readonly prismaService:PrismaService,
	            private socketsService:SocketGatewaysGateway) {}

	async create(user:UserModel, channelId: string, messageDto: IMessageCreateDTO): Promise<MessageModel> {
		//find chat using id and check if user is one of the chat members;
		const chat = await this.prismaService.chat.findFirst({where:{id:channelId, members:{some:{id:user.id}}}, include:{members:true}});
		if(!chat) throw new BadRequestException({message:"Chat not found"});

		const message = await this.prismaService.message.create({
			data: {
				...messageDto,
				chatId:chat.id,
				authorId:user.id
			},
			include:{
				author:true,
				chat:{
					include:{members:true}
				}
			}});

		await this.socketsService.sendNewMessageToClient(message);
		return message;

	}

	async findAll(user:UserModel, chatId:string):Promise<(MessageModel & {author: UserModel, chat: ChatModel})[]>{
		const messages = await this.prismaService.message.findMany({
			where:{
				chatId,
			},
			orderBy:{
				createdAt:"asc",
			},
			include:{
				chat:true,
				author:true,
			}
		});

		return messages;
	}
	async update(userId:string, messageId: string, messageDto: Partial<IMessageCreateDTO>): Promise<MessageModel> {
		const message = await this.prismaService.message.findFirst({where:{id:messageId}, include:{author:true}});
		if(!message) throw new BadRequestException({message:"Message not found"});

		if(message.author.id !== userId) throw new ForbiddenException({message:"You can edit only your messages"});

		const updatedMessage = await this.prismaService.message.update({where: {id: message.id},
			data:messageDto,
			include:{
				chat:{
					include:{
						members:true
					}
				},
				author:true
			}
		});

		await this.socketsService.sendMessageEdit(updatedMessage);
		return updatedMessage;
	}

	async delete(userId:string, messageId: string): Promise<void> {
		const message = await this.prismaService.message.findFirst({where:{id:messageId, authorId:userId}});
		if(!message) throw new BadRequestException({message:"Message not found"});
		const deletedMessage = await this.prismaService.message.delete({
			where:{
				id:message.id
			},
			include:{
				chat:{
					include:{
						members:true
					}
				},
				author:true
			}
		});

		await this.socketsService.sendMessageDelete(deletedMessage);
	}
}


export const MessagingServiceProvider:Provider = {
	provide:ServicesInjectTokens.MessagingService,
	useClass:MessagingService
};