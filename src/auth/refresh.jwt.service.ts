import "dotenv/config";
import { Injectable, Provider } from "@nestjs/common";
import { IJwtService } from "./interfaces/IJwt.service";
import { User as UserModel } from "@prisma/client";
import { JwtService as NestJwt } from "@nestjs/jwt";


@Injectable()
export class RefreshJwtService implements IJwtService {
	constructor(private readonly jwtService: NestJwt) {}

	private getJwtSecret(): string {
		return process.env.JWT_REFRESH_SECRET || "gdshjohgvfhjdkogvfgvbhjdkojwiuy84132hji12uyguhi";
	}

	async generateJwt(user: UserModel): Promise<string> {
		const secret = this.getJwtSecret();
		const refreshToken = this.jwtService.sign(user, { expiresIn: "15d", secret });
		return refreshToken;
	}

	async verifyJwt(jwt: string): Promise<UserModel | null> {
		const secret = this.getJwtSecret();
		return await this.jwtService.verifyAsync(jwt, { secret }).catch(() => null);
	}
}

export const RefreshJwtServiceProvider: Provider = {
	provide: "RefreshJwtService",
	useClass: RefreshJwtService,
};
