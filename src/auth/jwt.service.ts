import "dotenv/config";
import { Injectable, Provider } from "@nestjs/common";
import { IJwtService } from "./interfaces/IJwt.service";
import { User as UserModel } from "@prisma/client";
import { ISessionTokens } from "./interfaces/ISession.tokens";
import { JwtService as NestJwt } from "@nestjs/jwt";


@Injectable()
export class JwtService implements IJwtService {
	constructor(private readonly jwtService: NestJwt) {};

	private getJwtSecret(): string {
		return process.env.JWT_SECRET || "asdfbgfdafgewr32rdsgbkfnskfshbj3";
	}

	async generateJwtPair(user: UserModel): Promise<ISessionTokens> {
		const accessToken = this.jwtService.sign(user, { expiresIn: "15m" });
		const refreshToken = this.jwtService.sign(user, { expiresIn: "15d" });
		return {
			accessToken,
			refreshToken,
		};
	}

	async verifyJwt(jwt: string): Promise<UserModel | null> {
		const secret = this.getJwtSecret();
		return await this.jwtService.verifyAsync(jwt, { secret }).catch(() => null);
	}
}

export const JwtServiceProvider: Provider = {
	provide: "JwtService",
	useClass: JwtService,
};
