import {
	OnGatewayConnection,
	OnGatewayDisconnect, OnGatewayInit,
	WebSocketGateway, WebSocketServer,
	BaseWsExceptionFilter
} from "@nestjs/websockets";
import { SocketGatewaysService } from './socket-gateways.service';
import { Server, Socket } from "socket.io";
import { Inject, Logger, UseFilters } from "@nestjs/common";
import { ServicesInjectTokens } from "../services.inject.tokens";
import {Message as MessageModel, Chat as ChatModel, User as UserModel} from "@prisma/client";

@WebSocketGateway({cors:{origin:"*"}})
@UseFilters(new BaseWsExceptionFilter())
export class SocketGatewaysGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit{
	constructor(@Inject(ServicesInjectTokens.SocketGatewaysService) private readonly socketGatewaysService: SocketGatewaysService) {}
	private readonly logger:Logger = new Logger("WebSocketGateways");

	@WebSocketServer() wws:Server;

	afterInit(server: Server): any {
		this.logger.log("Socket's server started successfully")
	}

	async handleConnection(client: Socket): Promise<any> {
		await this.socketGatewaysService.onConnectionAuthentificate(client)
		this.logger.log(`New client connected with access token ${JSON.stringify(client.handshake.headers.authorization)}`);
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


	handleDisconnect(client: Socket): any {
	}


}
