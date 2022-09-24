import { Injectable, Provider } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User as UserModel } from "@prisma/client";
import { IUserService } from "./interfaces/IUser.service";
import { IUserDTO } from "./interfaces/IUser.dto";
import { ServicesInjectTokens } from "../services.inject.tokens";

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

	async edit(data: Partial<IUserDTO>): Promise<UserModel> {
		const user = await this.prismaService.user.update({ where: { phoneNumber: data.phoneNumber }, data });
		return user;
	}

	async delete(id: string): Promise<void> {}
}

export const UserServiceProvider: Provider = {
	provide: ServicesInjectTokens.UserService,
	useClass: UserService,
};
