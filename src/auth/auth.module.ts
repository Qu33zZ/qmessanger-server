import { Module } from "@nestjs/common";
import { AuthServiceProvider } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../prisma/prisma.module";
import {  JwtServiceProvider } from "./jwt.service";
import { JwtModule } from "@nestjs/jwt";
import "dotenv/config";
import { SmsModule } from "../sms/sms.module";

@Module({
	controllers: [AuthController],
	providers: [
		AuthServiceProvider,
		JwtServiceProvider,
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
