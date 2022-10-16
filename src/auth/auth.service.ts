import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	Provider,
	UnauthorizedException,
} from "@nestjs/common";
import { ILoginDTO } from "./interfaces/ILogin.dto";
import { IAuthService } from "./interfaces/IAuth.service";
import { PrismaService } from "../prisma/prisma.service";
import { Session as SessionModel, User as UserModel } from "@prisma/client";
import { IJwtService } from "./interfaces/IJwt.service";
import { ILoginResponse } from "./interfaces/ILogin.response";
import { IEmailVerificationService } from "../email-verification/interfaces/IEmail.verification.service";
import { InjectJwtService } from "./decotators/jwt.service.inject";
import { InjectEmailVerificationService } from "../email-verification/decotators/email-verification.service.inject";

@Injectable()
export class AuthService implements IAuthService {
	constructor(
		private readonly prismaService: PrismaService,
		@InjectJwtService private readonly jwtService: IJwtService,
		@InjectEmailVerificationService private readonly loginVerificationService:IEmailVerificationService
	) {}

	async login(loginDTO: ILoginDTO): Promise<any> {
		let user = await this.prismaService.user.findFirst({
			where: {
				email: loginDTO.email,
			},
		});

		if (!user)
			user = await this.prismaService.user.create({
				data: {
					name: "User",
					surname: (Math.random() * 10000).toFixed(0),
					email: loginDTO.email,
				},
			});

		const code = await this.createVerificationCode(user);
		this.loginVerificationService.sendMessage(code, loginDTO.email);
		//this.smsService.sendMessage(`Your verification code - ${code}`, loginDTO.phoneNumber);

		return { userId: user.id};
	}

	async confirmLogin(code: string, userId: string): Promise<ILoginResponse> {
		const user = await this.prismaService.user.findUnique({ where: { id: userId } });
		if (!user) throw new NotFoundException({ message: "User not found" });

		const authCode = await this.prismaService.authCode.findFirst({ where: { userId: userId, code } });
		if (!authCode) throw new UnauthorizedException({ message: "Invalid authorization code" });

		const session = await this.createSession(user);

		await this.prismaService.authCode.delete({ where: { id: authCode.id } });

		return {
			user,
			session,
		};
	}

	async refresh(refreshToken:string):Promise<ILoginResponse>{
		console.log("Refreshing")
		if(!refreshToken) throw new BadRequestException({message:"Invalid refresh token: no token"});

		const session = await this.prismaService.session.findFirst({where:{refreshToken}});
		if(!session) throw new BadRequestException({message:"Invalid refresh token: no session"});

		const validTokenData = await this.jwtService.verifyJwt(refreshToken);
		if(!validTokenData) throw new BadRequestException({message:"Invalid refresh token: invalid token"});

		const user = await this.prismaService.user.findFirst({where:{id:validTokenData.id}});

		const newPairOfTokens = await this.jwtService.generateJwtPair(user);

		const updatedSession = await this.prismaService.session.update({where:{id:session.id}, data:{...newPairOfTokens, createdAt:new Date()}})

		return {
			session:updatedSession,
			user
		}
	}
	private async createVerificationCode(user: UserModel): Promise<string> {
		const code = Math.round(Math.random() * 900000 + 100000).toString();
		await this.prismaService.authCode.create({ data: { userId: user.id, code } });
		return code;
	}

	async logout(sessionId: string) {
		return;
	}

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
};

export const AuthServiceProvider: Provider = {
	provide: "AuthService",
	useClass: AuthService,
};
