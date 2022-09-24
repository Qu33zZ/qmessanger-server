import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UserService } from "../../user/user.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private readonly prismaService: PrismaService) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request?.headers?.authorization?.split(" ")[1];
		if (!token) throw new UnauthorizedException({ message: "Invalid authorization token" });

		const session = await this.prismaService.session.findFirst({
			where: { accessToken: token },
			include: { user: true },
		});
		if (!session) throw new UnauthorizedException({ message: "Invalid authorization token" });

		if (!session.user) throw new UnauthorizedException({ message: "Discord user not found" });

		Reflect.defineMetadata("user", session.user, context.getHandler());
		return true;
	}
}
