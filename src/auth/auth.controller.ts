import { Body, Controller, HttpCode, HttpStatus, Inject, Param, Post } from "@nestjs/common";

import { ILoginDTO } from "./interfaces/ILogin.dto";
import { IAuthService } from "./interfaces/IAuth.service";
import { AuthService } from "./auth.service";
import { ILoginResponse } from "./interfaces/ILogin.response";

@Controller("auth")
export class AuthController {
	constructor(
		@Inject(AuthService)
		private readonly authService: IAuthService,
	) {}

	@Post("/login")
	@HttpCode(HttpStatus.OK)
	async login(@Body() data: ILoginDTO){
		return await this.authService.login(data);
	}

	@Post("/confirmLogin/:userId/:code")
	@HttpCode(HttpStatus.OK)
	async confirmLogin(@Param("userId") userId:string, @Param("code") code:string):Promise<ILoginResponse> {
		console.log(`Code ${code} | id ${userId} `)
		return await this.authService.confirmLogin(code, userId);
	}

	@Post("/logout")
	@HttpCode(HttpStatus.OK)
	async logout(@Body("sessionId") sessionId: string) {
		return await this.authService.logout(sessionId);
	}
}
