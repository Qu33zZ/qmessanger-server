import { User as UserModel } from "@prisma/client";

export interface IJwtService {
	generateJwt(user: UserModel): Promise<string>;
	verifyJwt(token:string):Promise<UserModel | null>;
}
