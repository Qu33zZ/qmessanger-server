import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { SmsModule } from "./sms-verification/sms.module";
import { ChatModule } from "./chat/chat.module";
import { MessagingModule } from './messaging/messaging.module';
import { SocketGatewaysModule } from './socket-gateways/socket-gateways.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';

@Module({
	imports: [PrismaModule, AuthModule, UserModule, SmsModule, ChatModule, MessagingModule, SocketGatewaysModule, EmailVerificationModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
