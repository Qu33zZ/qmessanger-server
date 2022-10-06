export interface IEmailVerificationService {
	sendMessage(code: string, email: string): Promise<any>;
}
