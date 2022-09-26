import { Injectable, Provider } from "@nestjs/common";
import { ServicesInjectTokens } from "../services.inject.tokens";
import { WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@Injectable()
export class SocketGatewaysService {
	@WebSocketServer()
	wws:Server;

	async onConectionAuthentificate(){

	};

	async sendNewMessage(){
	}

}


export const SocketGatewaysServiceProvider:Provider = {
	provide:ServicesInjectTokens.SocketGatewaysService,
	useClass:SocketGatewaysService
};