import { BadRequestException, Injectable, Provider } from "@nestjs/common";
import { IChatService } from "./interfaces/IChatService";
import { IChatCreateDTO } from "./interfaces/IChat.create.dto";
import { Chat as ChatModel, User as UserModel } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { IUserService } from "../user/interfaces/IUser.service";
import { InjectUserService } from "../user/decorators/user.service.inject";

@Injectable()
export class ChatService implements IChatService {
	constructor(
		private readonly prismaService: PrismaService,
		@InjectUserService private readonly userService: IUserService,
	) {}

	private async checkIfChatExists(members:string[]):Promise<boolean>{
		const chat = await this.prismaService.chat.findFirst({
			where:{
				members:{
					every:{id:{in:members}}
				}
			},
			include:{members:true}
		});

		return !!chat;
	}

	async create(user: UserModel, dto: IChatCreateDTO): Promise<ChatModel> {
		const member = await this.userService.find("id", dto.memberId);
		if (!member) throw new BadRequestException({ message: `User ${dto.memberId} not found. Invalid id provided!` });

		if(user.id === dto.memberId) throw new BadRequestException({message:"You can't create chat with yourself"});

		const chatAlreadyExists = await this.checkIfChatExists([user.id, dto.memberId]);
		if(chatAlreadyExists) throw new BadRequestException({message:"Chat already exists"})

		const chat = await this.prismaService.chat.create({
			data: {
				members: {
					connect: [{id:user.id}, {id:member.id}],
				},
			},
			include:{members:true, messages:true}
		});
		return chat;
	}

	async findAll(user: UserModel): Promise<ChatModel[]> {
		const chats = await this.prismaService.chat.findMany({
			where: {
				members:{some:user},
			},
			include:{
				members:true,
				messages:{
					orderBy:{createdAt:"desc"},
					take:1
				}
			}
		})
		return chats;
	}

	async delete(chatId: string): Promise<ChatModel> {
		const chat = await this.prismaService.chat.delete({ where: { id: chatId } });
		return chat;
	}

}

export const ChatServiceProvider: Provider = {
	provide: "ChatService",
	useClass: ChatService,
};
