import { Module } from '@nestjs/common';
import { MessagingServiceProvider } from "./messaging.service";
import { MessagingController } from './messaging.controller';
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
	controllers: [MessagingController],
	providers: [MessagingServiceProvider],
	imports:[AuthModule, PrismaModule]
})
export class MessagingModule {}
