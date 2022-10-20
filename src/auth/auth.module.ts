import "dotenv/config";
import { Module } from "@nestjs/common";
import { AuthServiceProvider } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtServiceProvider } from "./jwt.service";
import { JwtModule } from "@nestjs/jwt";
import { EmailVerificationModule } from "../email-verification/email-verification.module";

@Module({
	controllers: [AuthController],
	providers: [AuthServiceProvider, JwtServiceProvider],
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET || "asdfbgfdafgewr32rdsgbkfnskfshbj3",
		}),
		PrismaModule,
		EmailVerificationModule,

	],
	exports:[JwtServiceProvider]
})
export class AuthModule {}

