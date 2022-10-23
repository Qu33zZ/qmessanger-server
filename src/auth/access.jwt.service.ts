import "dotenv/config";
import { Injectable, Provider } from "@nestjs/common";
import { IJwtService } from "./interfaces/IJwt.service";
import { User as UserModel } from "@prisma/client";
import { JwtService as NestJwt } from "@nestjs/jwt";


@Injectable()
export class AccessJwtService implements IJwtService {
	constructor(private readonly jwtService: NestJwt) {}

	private getJwtSecret(): string {
		return process.env.JWT_ACCESS_SECRET || "asdfbgfdafgewr32rdsgbkfnskfshbj3";
	}

	async generateJwt(user: UserModel): Promise<string> {
		const secret = this.getJwtSecret();
		const accessToken = this.jwtService.sign(user, { expiresIn: "15m", secret});
		return accessToken;
	}

	async verifyJwt(jwt: string): Promise<UserModel | null> {
		const secret = this.getJwtSecret();
		return await this.jwtService.verifyAsync(jwt, { secret }).catch(() => null);
	}
}

export const AccessJwtServiceProvider: Provider = {
	provide: "AccessJwtService",
	useClass: AccessJwtService,
};

