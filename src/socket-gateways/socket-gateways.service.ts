import { HttpStatus, Injectable, Provider } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { PrismaService } from "../prisma/prisma.service";
import { Chat as ChatModel, Message as MessageModel, User as UserModel } from "@prisma/client";

@Injectable()
export class SocketGatewaysService {
	constructor(private prismaService:PrismaService) {
	}

	private socketsWithUsersId = {};

	async onConnectionAuthentificate(client:Socket){
		const token = client.handshake.headers.authorization.split(" ")[1];
		const session = await this.prismaService.session.findFirst({
			where: { accessToken:token},
			include: { user: true },
		});
		if (!session) return new WsException({ message: "Invalid authorization token", code:HttpStatus.UNAUTHORIZED});
		if (!session.user) return new WsException({ message: "User not found", code:HttpStatus.UNAUTHORIZED});
		this.socketsWithUsersId[session.user.id] = client.id;

		console.log(JSON.stringify(session));
		console.log(this.socketsWithUsersId);
	};

	async sendNewMessage(message: MessageModel & {author: UserModel, chat: ChatModel & {members:UserModel[]}}){
		const idsToSend = await this.getClientsId(message.author, message.chat);

		delete message.chat.members;

		return {clients:idsToSend, message};
	}

	async sendMessageDelete(message: MessageModel & {author: UserModel, chat: ChatModel & {members:UserModel[]}}){
		const idsToSend = await this.getClientsId(message.author, message.chat);

		return {clients:idsToSend, message};
	}

	async sendMessageEdit(message: MessageModel & {author: UserModel, chat: ChatModel & {members:UserModel[]}}){
		const idsToSend = await this.getClientsId(message.author, message.chat);

		return {clients:idsToSend, message};
	}

	private async getClientsId(messageAuthor:UserModel, chat:ChatModel & {members:UserModel[]}):Promise<string[]>{
		return chat.members.reduce((acc:string[], member) => {
			if(member.id !== messageAuthor.id) acc.push(this.socketsWithUsersId[member.id]);
			return acc;
		}, []);
	}

}


export const SocketGatewaysServiceProvider:Provider = {
	provide:"WebsocketService",
	useClass:SocketGatewaysService
};