import { Body, Controller, Headers, HttpCode, HttpStatus, Inject, Param, Post, Req } from "@nestjs/common";
import { ILoginDTO } from "./interfaces/ILogin.dto";
import { IAuthService } from "./interfaces/IAuth.service";
import { ILoginResponse } from "./interfaces/ILogin.response";
import { ServicesInjectTokens } from "../services.inject.tokens";
import { Request } from "express";

@Controller("auth")
export class AuthController {
	constructor(
		@Inject(ServicesInjectTokens.AuthService) private readonly authService: IAuthService,
	) {}

	@Post("/login")
	@HttpCode(HttpStatus.OK)
	async login(@Body() data: ILoginDTO) {
		return await this.authService.login(data);
	}

	@Post("/confirmLogin/:userId/:code")
	@HttpCode(HttpStatus.OK)
	async confirmLogin(@Param("userId") userId: string, @Param("code") code: string): Promise<ILoginResponse> {
		return await this.authService.confirmLogin(code, userId);
	}

	@Post("/refresh")
	@HttpCode(HttpStatus.OK)
	async refresh(@Req() request: Request) {
		return await this.authService.refresh(request.cookies?.refreshToken);
	}

	@Post("/logout")
	@HttpCode(HttpStatus.OK)
	async logout(@Body("sessionId") sessionId: string) {
		return await this.authService.logout(sessionId);
	}
}
