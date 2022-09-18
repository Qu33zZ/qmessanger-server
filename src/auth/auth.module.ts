import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtService } from "./jwt.service";
import { JwtModule } from "@nestjs/jwt";
import "dotenv/config";
import { SmsModule } from "../sms/sms.module";

@Module({
	controllers: [AuthController],
	providers: [
		{
			provide: AuthService,
			useClass: AuthService,
		},
		{
			provide: JwtService,
			useClass: JwtService,
		},
	],
	imports: [
		JwtModule.register({
			secret:process.env.JWT_SECRET || "asdfbgfdafgewr32rdsgbkfnskfshbj3",
		}),
		PrismaModule,
		SmsModule
	],
})
export class AuthModule {}
