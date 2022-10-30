import { HttpStatus, Injectable, Logger, Provider, Catch } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { PrismaService } from "../prisma/prisma.service";
import { Chat as ChatModel, Message as MessageModel, User as UserModel } from "@prisma/client";
import { ISocketsConnectedClients } from "./interfaces/ISockets.connected.clients";
import { WsExceptionsFilter } from "./handlers/exception.handler";

@Injectable()
@Catch(WsExceptionsFilter)
export class SocketGatewaysService {
	private readonly logger:Logger = new Logger("SocketGatewaysService")
	constructor(private prismaService:PrismaService) {
	}

	private socketsWithUsersId:ISocketsConnectedClients = {};

	private async authenticateUser(client:Socket):Promise<UserModel | null>{
		const token = client.handshake.headers.authorization.split(" ")[1];
		const session = await this.prismaService.session.findFirst({
			where: { accessToken:token},
			include: { user: true },
		});
		if (!session) throw new WsException({ message: "Invalid authorization token", code:HttpStatus.UNAUTHORIZED});
		if (!session.user) throw new WsException({ message: "User not found", code:HttpStatus.UNAUTHORIZED});

		return session.user;
	}

	async onConnectionAuthenticate(client:Socket){
		const user = await this.authenticateUser(client);
		if(!user) return new WsException({message:"Not authorized", code:HttpStatus.UNAUTHORIZED});

		//add socket.io id to connected clients
		if(this.socketsWithUsersId[user.id]){
			this.socketsWithUsersId[user.id].push(client.id);
		}else{
			this.socketsWithUsersId[user.id] = [client.id];
		}
	}

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

	async formatChatForEvents(chat:ChatModel & {members:UserModel[]}){
		const idsToSend = await this.getClientsId(chat);
		return {clients:idsToSend, chat};
	}

	async handleDisconnect(client:Socket):Promise<void>{
		const user = await this.authenticateUser(client);
		if(!user) return;

		const usersConnectedSocketsIds = this.socketsWithUsersId[user.id];

		//check if user has connected sessions
		if(!usersConnectedSocketsIds || usersConnectedSocketsIds.length === 0) return;

		const newClientsIds = usersConnectedSocketsIds.filter(socketId => socketId !== client.id);
		this.socketsWithUsersId[user.id] = newClientsIds;

		this.logger.log(`--- [ Disconnected ] ${client.id}`)
	};

	private async getClientsId(chat:ChatModel & {members:UserModel[]}):Promise<string[]>{
		return chat.members.reduce((acc:string[], member) => {
			acc.push(...(this.socketsWithUsersId[member.id] || []));
			return acc;
		}, []);
	}

}


export const SocketGatewaysServiceProvider:Provider = {
	provide:"WebsocketService",
	useClass:SocketGatewaysService
};