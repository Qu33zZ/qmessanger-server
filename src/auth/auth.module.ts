import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtService } from "./jwt.service";

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
	imports: [PrismaModule],
})
export class AuthModule {}
