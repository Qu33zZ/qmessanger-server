import { Module } from '@nestjs/common';
import { SocketGatewaysServiceProvider } from "./socket-gateways.service";
import { SocketGatewaysGateway } from './socket-gateways.gateway';
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
	providers: [SocketGatewaysGateway, SocketGatewaysServiceProvider],
	imports:[AuthModule, PrismaModule],
	exports:[SocketGatewaysServiceProvider, SocketGatewaysGateway]
})
export class SocketGatewaysModule {}
