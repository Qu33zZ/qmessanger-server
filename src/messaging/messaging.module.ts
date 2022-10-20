import { Module } from "@nestjs/common";
import { MessagingServiceProvider } from "./messaging.service";
import { MessagingController } from "./messaging.controller";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";
import { SocketGatewaysModule } from "../socket-gateways/socket-gateways.module";

@Module({
	controllers: [MessagingController],
	providers: [MessagingServiceProvider],
	imports:[AuthModule, PrismaModule, SocketGatewaysModule]
})
export class MessagingModule {}
