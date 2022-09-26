import { WebSocketGateway } from '@nestjs/websockets';
import { SocketGatewaysService } from './socket-gateways.service';

@WebSocketGateway()
export class SocketGatewaysGateway {
	constructor(private readonly socketGatewaysService: SocketGatewaysService) {}
}
