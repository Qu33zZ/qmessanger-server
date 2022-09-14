import { Inject, Injectable } from "@nestjs/common";
import { ILoginDTO } from "./interfaces/ILogin.dto";
import { IAuthService } from "./interfaces/IAuth.service";
import { PrismaService } from "../prisma/prisma.service";
import { Session as SessionModel, User as UserModel } from "@prisma/client";
import { JwtService } from "./jwt.service";
import { IJwtService } from "./interfaces/IJwt.service";
import { ILoginResponse } from "./interfaces/ILogin.response";

@Injectable()
export class AuthService implements IAuthService {
	constructor(
		private readonly prismaService: PrismaService,
		@Inject(JwtService) private readonly jwtService: IJwtService,
	) {}

	async login(loginDTO: ILoginDTO): Promise<ILoginResponse> {
		let user = await this.prismaService.user.findUnique({
			where: {
				phoneNumber: loginDTO.phoneNumber,
			},
		});

		if (!user)
			user = await this.prismaService.user.create({
				data: {
					name: "User",
					surname: (Math.random() * 10000).toFixed(0),
					phoneNumber: loginDTO.phoneNumber,
				},
			});

		const session = await this.createSession(user);

		return {
			user,
			session,
		};
	}

	async logout(sessionId: string) {}

	private async createSession(user: UserModel): Promise<SessionModel> {
		const jwtPair = await this.jwtService.generateJwtPair(user);

		const session = await this.prismaService.session.create({
			data: {
				...jwtPair,
				userId: user.id,
			},
		});
		return session;
	}
}
