import { User as UserModel } from "@prisma/client";
import { ISessionTokens } from "./ISession.tokens";

export interface IJwtService {
	generateJwtPair(user: UserModel): Promise<ISessionTokens>;
}
