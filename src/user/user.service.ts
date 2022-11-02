import { Injectable, Provider } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User as UserModel } from "@prisma/client";
import { IUserService } from "./interfaces/IUser.service";
import { IUserDTO } from "./interfaces/IUser.dto";
import { InjectFilesService } from "src/files/decorators/files.service.inject";
import { IFilesService } from "src/files/interfaces/ifiles.service";


@Injectable()
export class UserService implements IUserService {
	constructor(
		private readonly prismaService: PrismaService,
		@InjectFilesService private readonly filesService:IFilesService
	) {}

	async create(data): Promise<UserModel> {
		const user = await this.prismaService.user.create(data);
		return user;
	}

	async find(key: keyof UserModel, value: any): Promise<UserModel> {
		const user = await this.prismaService.user.findUnique({ where: { [key]: value } });
		return user;
	}

	async lookForUsersByUsername(username:string): Promise<UserModel[]>{
		const possibleUsers = await this.prismaService.user.findMany({
			where:{
				username:{startsWith:username}
			}
		});
		return possibleUsers;
	}

	async edit(user:UserModel, data: Partial<IUserDTO>): Promise<UserModel> {
		if(data.avatar && user.avatar){
			await this.filesService.deleteOldFile(user.avatar);
		}
		if(!user.verified){
			const updatedUser = await this.prismaService.user.update({ where: { id:user.id }, data:{...data, verified:true} });
			return updatedUser;
		}
		const updatedUser = await this.prismaService.user.update({ where: { id:user.id }, data });
		return updatedUser;
	}

	async delete(id: string): Promise<void> {}
}

//create custom provider for user service
export const UserServiceProvider: Provider = {
	provide: "UserService",
	useClass: UserService,
};
