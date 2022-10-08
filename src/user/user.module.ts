import { Module } from "@nestjs/common";
import { UserServiceProvider } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";

@Module({
	controllers: [UserController],
	providers: [UserServiceProvider],
	imports: [PrismaModule, AuthModule],
	exports:[UserServiceProvider]
})
export class UserModule {}
