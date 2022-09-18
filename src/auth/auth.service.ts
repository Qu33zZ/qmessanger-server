import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ILoginDTO } from "./interfaces/ILogin.dto";
import { IAuthService } from "./interfaces/IAuth.service";
import { PrismaService } from "../prisma/prisma.service";
import { Session as SessionModel, User as UserModel } from "@prisma/client";
import { JwtService } from "./jwt.service";
import { IJwtService } from "./interfaces/IJwt.service";
import { ILoginResponse } from "./interfaces/ILogin.response";
import { SmsServiceAws } from "../sms/sms.service";

@Injectable()
export class AuthService implements IAuthService {
	constructor(
		private readonly prismaService: PrismaService,
		@Inject(SmsServiceAws) private readonly smsService:SmsServiceAws,
		@Inject(JwtService) private readonly jwtService: IJwtService,
	) {}

	async login(loginDTO: ILoginDTO): Promise<any> {
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

		const code = await this.createVerificationCode(user);

		this.smsService.sendMessage(`Your verification code - ${code}`, loginDTO.phoneNumber);

		return {userId:user.id};
	}

	async confirmLogin(code:string, userId:string):Promise<ILoginResponse>{
		const user = await this.prismaService.user.findUnique({where:{id:userId}});
		if(!user) throw new NotFoundException({message:"User not found"});

		const authCode = await this.prismaService.authCode.findFirst({where:{userId:userId, code}});
		if(!authCode) throw new UnauthorizedException({message:"Invalid authorization code"});

		const session = await this.createSession(user);

		await this.prismaService.authCode.delete({where:{id:authCode.id}});

		return {
			user,
			session
		}
	}

	private async createVerificationCode(user:UserModel):Promise<string>{
		const code = Math.round((Math.random() * (900000) + 100000)).toString();
		await this.prismaService.authCode.create({data:{userId:user.id, code}});
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
}
