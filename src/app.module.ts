import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { SmsModule } from "./sms/sms.module";
import { ChatModule } from "./chat/chat.module";
import { MessagingModule } from './messaging/messaging.module';

@Module({
	imports: [PrismaModule, AuthModule, UserModule, SmsModule, ChatModule, MessagingModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
