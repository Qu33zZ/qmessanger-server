import { HttpCode, HttpException, HttpStatus, Injectable, Provider } from "@nestjs/common";
import { ServicesInjectTokens } from "../services.inject.tokens";
import { IEmailVerificationService } from "./interfaces/IEmail.verification.service";
import { createTransport } from "nodemailer";
import { NODEMAILER_CONFIG } from "../nodemailer.config";
import "dotenv/config";

@Injectable()
export class EmailVerificationService implements IEmailVerificationService{
	async sendMessage(code: string, email: string): Promise<any> {
		const message = {
			from:process.env.GMAIL_USER,
			to:email,
			subject:"QMessanger verification",
			text:`Your verification code for QMessanger is **${code}**`
		};

		const transport = createTransport(NODEMAILER_CONFIG);
		transport.sendMail(message,(err) => {
			throw new HttpException(
				{
					message:"Unable to send email"
				},
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		})
	}
}


export const EmailEmailVerificationServiceProvider:Provider={
	provide:ServicesInjectTokens.EmailVerificationService,
	useClass:EmailVerificationService
};