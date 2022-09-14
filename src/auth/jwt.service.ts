import { Injectable } from "@nestjs/common";
import { IJwtService } from "./interfaces/IJwt.service";
import { User as UserModel } from "@prisma/client";
import { ISessionTokens } from "./interfaces/ISession.tokens";

@Injectable()
export class JwtService implements IJwtService {
	async generateJwtPair(user: UserModel): Promise<ISessionTokens> {
		return {
			accessToken: "123",
			refreshToken: "123",
		};
	}
}
