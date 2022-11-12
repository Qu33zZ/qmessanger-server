import { Module } from "@nestjs/common";
import { UserServiceProvider } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { randomUUID } from "crypto";
import { FilesModule } from "../files/files.module";

@Module({
	controllers: [UserController],
	providers: [UserServiceProvider],
	imports: [
		PrismaModule, 
		AuthModule,
		MulterModule.register({
			storage:diskStorage({
				destination:"./uploads/users/avatars",
				filename(req, file, callback) {
					const fileExtName = extname(file.originalname);
					callback(null, `${randomUUID()}${fileExtName}`);
				},
				
			})
		}),
		FilesModule.forRoot({
			module:"users",
			submodule:"avatars"
		})
	],
	exports:[UserServiceProvider]
})
export class UserModule {}
