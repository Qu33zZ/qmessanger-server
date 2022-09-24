import { User as UserModel } from "@prisma/client";
import { IUserDTO } from "./IUser.dto";

export interface IUserService {
	find(key: keyof UserModel, value: any): Promise<UserModel>;
	create(data: IUserDTO): Promise<UserModel>;
	edit(userId:string, dto:Partial<IUserDTO>): Promise<UserModel>;
	delete(id: string): Promise<void>;
}
