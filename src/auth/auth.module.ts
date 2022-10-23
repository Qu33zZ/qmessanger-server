import "dotenv/config";
import { Module } from "@nestjs/common";
import { AuthServiceProvider } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { RefreshJwtServiceProvider } from "./refresh.jwt.service";
import { AccessJwtServiceProvider } from "./access.jwt.service";
import { JwtModule } from "@nestjs/jwt";
import { EmailVerificationModule } from "../email-verification/email-verification.module";

@Module({
	controllers: [AuthController],
	providers: [AuthServiceProvider, AccessJwtServiceProvider, RefreshJwtServiceProvider],
	imports: [
		JwtModule.register({}),
		PrismaModule,
		EmailVerificationModule,

	],
	exports:[AccessJwtServiceProvider, RefreshJwtServiceProvider]
})
export class AuthModule {}

