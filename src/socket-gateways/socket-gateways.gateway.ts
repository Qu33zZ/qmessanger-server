import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
	WebSocketServer, WsException
} from "@nestjs/websockets";
import { SocketGatewaysService } from "./socket-gateways.service";
import { Server, Socket } from "socket.io";
import { Logger} from "@nestjs/common";
import { Chat as ChatModel, Message as MessageModel, User as UserModel } from "@prisma/client";
import { InjectWebsocketService } from "./decotators/chat.service.inject";

@WebSocketGateway({cors:{origin:"*"}})
export class SocketGatewaysGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit{
	constructor(@InjectWebsocketService private readonly socketGatewaysService: SocketGatewaysService) {}
	private readonly logger:Logger = new Logger("WebSocketGateways");

	@WebSocketServer() wws:Server;
	
	afterInit(server: Server): void {
		this.logger.log("Socket's server started successfully")
	}

	async handleConnection(client: Socket): Promise<void> {
		const user = await this.socketGatewaysService.onConnectionAuthenticate(client);
		if(user) this.sendUserGoToOnline(user);
	}

	async handleDisconnect(client: Socket): Promise<any> {
		const user = await this.socketGatewaysService.handleDisconnect(client);
		if(user) this.sendUserGoToOffline(user);

	}

	async sendNewMessageToClient(message: MessageModel & {author: UserModel, chat: ChatModel & {members:UserModel[]}}):Promise<any>{
		const messageData = await this.socketGatewaysService.sendNewMessage(message);
		this.wws.to(messageData.clients).emit("message", message);
	}

	async sendMessageDelete(message: MessageModel & {author: UserModel, chat: ChatModel & {members:UserModel[]}}):Promise<any>{
		const messageData = await this.socketGatewaysService.sendMessageDelete(message);
		this.wws.to(messageData.clients).emit("messageDelete", message);
	}

	async sendMessageEdit(message: MessageModel & {author: UserModel, chat: ChatModel & {members:UserModel[]}}):Promise<any>{
		const messageData = await this.socketGatewaysService.sendMessageEdit(message);
		this.wws.to(messageData.clients).emit("messageEdit", message);
	}

	async sendChatCreation(chat:ChatModel & {members:UserModel[]}){
		const chatData = await this.socketGatewaysService.formatChatForEvents(chat)
		this.wws.to(chatData.clients).emit("chatCreate", chat);
	}

	private async sendUserGoToOnline(user:UserModel): Promise<void>{
		const clientIds = await this.socketGatewaysService.getMutualUsersClientsIds(user);
		this.wws.to(clientIds).emit("userOnline", user.id);
	}

	private async sendUserGoToOffline(user:UserModel): Promise<void>{
		const clientIds = await this.socketGatewaysService.getMutualUsersClientsIds(user);
		this.wws.to(clientIds).emit("userOffline", {userId:user.id, lastOnlineAt:user.lastOnlineAt});
	}

}
