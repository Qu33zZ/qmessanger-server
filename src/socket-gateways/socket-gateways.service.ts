import { HttpStatus, Injectable, Provider} from "@nestjs/common";
import { ServicesInjectTokens } from "../services.inject.tokens";
import { WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PrismaService } from "../prisma/prisma.service";
import {Message as MessageModel, Chat as ChatModel, User as UserModel} from "@prisma/client";

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
		if (!session) throw new WsException({ message: "Invalid authorization token", code:HttpStatus.UNAUTHORIZED});
		if (!session.user) throw new WsException({ message: "User not found", code:HttpStatus.UNAUTHORIZED});
		this.socketsWithUsersId[session.user.id] = client.id;

		console.log(JSON.stringify(session));
		console.log(this.socketsWithUsersId);
	};

	async sendNewMessage(message: MessageModel & {author: UserModel, chat: ChatModel & {members:UserModel[]}}){
		const idsToSend = message.chat.members.map(member => this.socketsWithUsersId[member.id]);

		delete message.chat.members;

		return {clients:idsToSend, message};
	}

}


export const SocketGatewaysServiceProvider:Provider = {
	provide:ServicesInjectTokens.SocketGatewaysService,
	useClass:SocketGatewaysService
};