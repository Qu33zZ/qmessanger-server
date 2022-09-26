import { Module } from '@nestjs/common';
import { SocketGatewaysService, SocketGatewaysServiceProvider } from "./socket-gateways.service";
import { SocketGatewaysGateway } from './socket-gateways.gateway';

@Module({
	providers: [SocketGatewaysGateway, SocketGatewaysServiceProvider]
})
export class SocketGatewaysModule {}
