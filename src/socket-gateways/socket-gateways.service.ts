import { HttpStatus, Injectable, Provider } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { PrismaService } from "../prisma/prisma.service";
import { Chat as ChatModel, Message as MessageModel, User as UserModel } from "@prisma/client";
import { ISocketsConnectedClients } from "./interfaces/ISockets.connected.clients";

@Injectable()
export class SocketGatewaysService {
	constructor(private prismaService:PrismaService) {
	}

	private socketsWithUsersId:ISocketsConnectedClients = {};

	async onConnectionAuthentificate(client:Socket){
		const token = client.handshake.headers.authorization.split(" ")[1];
		const session = await this.prismaService.session.findFirst({
			where: { accessToken:token},
			include: { user: true },
		});
		if (!session) return new WsException({ message: "Invalid authorization token", code:HttpStatus.UNAUTHORIZED});
		if (!session.user) return new WsException({ message: "User not found", code:HttpStatus.UNAUTHORIZED});
		//add socket.io id to connected clients
		if(this.socketsWithUsersId[session.user.id]){
			this.socketsWithUsersId[session.user.id].push(client.id);
		}else{
			this.socketsWithUsersId[session.user.id] = [client.id];
		}
	};

	async sendNewMessage(message: MessageModel & {author: UserModel, chat: ChatModel & {members:UserModel[]}}){
		const idsToSend = await this.getClientsId(message.chat);

		delete message.chat.members;

		return {clients:idsToSend, message};
	}

	async sendMessageDelete(message: MessageModel & {author: UserModel, chat: ChatModel & {members:UserModel[]}}){
		const idsToSend = await this.getClientsId(message.chat);

		return {clients:idsToSend, message};
	}

	async sendMessageEdit(message: MessageModel & {author: UserModel, chat: ChatModel & {members:UserModel[]}}){
		const idsToSend = await this.getClientsId(message.chat);

		return {clients:idsToSend, message};
	}

	private async getClientsId(chat:ChatModel & {members:UserModel[]}):Promise<string[]>{
		return chat.members.reduce((acc:string[], member) => {
			acc.push(...this.socketsWithUsersId[member.id]);
			return acc;
		}, []);
	}

}


export const SocketGatewaysServiceProvider:Provider = {
	provide:"WebsocketService",
	useClass:SocketGatewaysService
};