import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { IJwtService } from "../interfaces/IJwt.service";
import { InjectJwtService } from "../decotators/jwt.service.inject";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(
		private readonly prismaService: PrismaService,
		@InjectJwtService private readonly jwtService:IJwtService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request?.headers?.authorization?.split(" ")[1];
		if (!token) throw new UnauthorizedException({ message: "Invalid authorization token" });

		const session = await this.prismaService.session.findFirst({
			where: { accessToken: token },
			include: { user: true },
		});
		if (!session) throw new UnauthorizedException({ message: "Invalid authorization token" });

		const isTokenValid = await this.jwtService.verifyJwt(token);
		if(!isTokenValid) throw new UnauthorizedException({ message: "Invalid authorization token" });

		if (!session.user) throw new UnauthorizedException({ message: "User not found" });

		//save user to metadata to get it in controller later, using @User decorator
		Reflect.defineMetadata("user", session.user, context.getHandler());
		return true;
	}
}
