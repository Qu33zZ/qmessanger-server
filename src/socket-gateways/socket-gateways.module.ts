import { Module } from "@nestjs/common";
import { SocketGatewaysServiceProvider } from "./socket-gateways.service";
import { SocketGatewaysGateway } from "./socket-gateways.gateway";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "../user/user.module";

@Module({
	providers: [SocketGatewaysGateway, SocketGatewaysServiceProvider],
	imports:[AuthModule, PrismaModule, UserModule],
	exports:[SocketGatewaysGateway, SocketGatewaysServiceProvider]
})
export class SocketGatewaysModule {}
