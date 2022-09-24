import { Module } from "@nestjs/common";
import { ChatServiceProvider } from "./chat.service";
import { ChatController } from "./chat.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";

@Module({
	controllers: [ChatController],
	providers: [ChatServiceProvider],
	imports:[PrismaModule, UserModule, AuthModule]
})
export class ChatModule {}
