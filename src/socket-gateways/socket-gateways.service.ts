import { Injectable, Logger, Provider } from "@nestjs/common";
import { Socket } from "socket.io";
import { PrismaService } from "../prisma/prisma.service";
import { Chat as ChatModel, Message as MessageModel, User as UserModel } from "@prisma/client";
import { ISocketsConnectedClients } from "./interfaces/ISockets.connected.clients";
import { InjectUserService } from "src/user/decorators/user.service.inject";
import { UserService } from "src/user/user.service";
import { IUserService } from "src/user/interfaces/IUser.service";

@Injectable()
export class SocketGatewaysService {
	private readonly logger:Logger = new Logger("SocketGatewaysService")
	constructor(
		private prismaService:PrismaService,
		@InjectUserService private readonly userService:IUserService
	) {}

	private socketsWithUsersId:ISocketsConnectedClients = {};

	async getMutualUsersClientsIds(user:UserModel):Promise<string[]>{
		const mutualUsers = await this.userService.getMutualUsers(user);

		const usersOnlineSocketIds = new Set<string>(mutualUsers.reduce((acc, mutualUser) => {
			if(this.socketsWithUsersId[mutualUser.id] && this.socketsWithUsersId[mutualUser.id].length > 0){
				acc.push(...this.socketsWithUsersId[mutualUser.id])
			}
			return acc;
		}, []))


		return Array.from(usersOnlineSocketIds);
	}

	private async authenticateUser(client:Socket):Promise<UserModel | null>{
		const token = client.handshake.headers.authorization.split(" ")[1];
		const session = await this.prismaService.session.findFirst({
			where: { accessToken:token},
			include: { user: true },
		});

		if (!session) return null;

		return session.user;
	}

	isUserOnline(userId:string){
		return !!this.socketsWithUsersId[userId];
	}

	async onConnectionAuthenticate(client:Socket){
		const user = await this.authenticateUser(client);
		if(!user){
			client.disconnect();
			return;
		}
		if(this.socketsWithUsersId[user.id]){
			this.socketsWithUsersId[user.id].push(client.id);
		}else {
			this.socketsWithUsersId[user.id] = [client.id];
		}

		return user;
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

	async handleDisconnect(client:Socket):Promise<UserModel>{
		const user = await this.authenticateUser(client);
		if(!user) return;
		//update last online at status
		const updatedUser = await this.prismaService.user.update({
			where:{
				id:user.id,
			},
			data:{
				lastOnlineAt:new Date()
			}
		})
		const usersConnectedSocketsIds = this.socketsWithUsersId[user.id];

		//check if user has connected sessions
		if(!usersConnectedSocketsIds || usersConnectedSocketsIds.length === 0) return;

		const newClientsIds = usersConnectedSocketsIds.filter(socketId => socketId !== client.id);
		this.socketsWithUsersId[user.id] = newClientsIds;

		this.logger.log(`--- [ Disconnected ] ${client.id}`)
		return updatedUser;

	}

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