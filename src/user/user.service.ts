import { Injectable, Provider } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User as UserModel } from "@prisma/client";
import { IUserService } from "./interfaces/IUser.service";
import { IUserDTO } from "./interfaces/IUser.dto";


@Injectable()
export class UserService implements IUserService {
	constructor(private readonly prismaService: PrismaService) {}

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
				name:{startsWith:username}
			}
		});
		return possibleUsers;
	}

	async edit(userId:string, data: Partial<IUserDTO>): Promise<UserModel> {
		const user = await this.prismaService.user.update({ where: { id:userId }, data });
		return user;
	}

	async delete(id: string): Promise<void> {}
}

export const UserServiceProvider: Provider = {
	provide: "UserService",
	useClass: UserService,
};
