import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from './user/user.module';
import { SmsModule } from './sms/sms.module';

@Module({
	imports: [PrismaModule, AuthModule, UserModule, SmsModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
