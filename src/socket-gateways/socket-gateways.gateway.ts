import {
	OnGatewayConnection,
	OnGatewayDisconnect, OnGatewayInit,
	WebSocketGateway,
} from "@nestjs/websockets";
import { SocketGatewaysService } from './socket-gateways.service';
import { Server, Socket } from "socket.io";
import { Inject, Logger } from "@nestjs/common";
import { ServicesInjectTokens } from "../services.inject.tokens";

@WebSocketGateway()
export class SocketGatewaysGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit{
	constructor(@Inject(ServicesInjectTokens.SocketGatewaysService) private readonly socketGatewaysService: SocketGatewaysService) {}
	private readonly logger:Logger = new Logger("WebSocketGateways");
	afterInit(server: Server): any {
		this.logger.log("Socket's server started successfully")
	}

	handleConnection(client: Socket): any {
		this.logger.log(`New client connected with id ${client.id}`);
	}

	handleDisconnect(client: Socket): any {
	}


}
