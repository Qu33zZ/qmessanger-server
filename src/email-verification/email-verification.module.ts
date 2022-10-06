import { Module } from '@nestjs/common';
import { EmailEmailVerificationServiceProvider, EmailVerificationService } from "./email-verification.service";

@Module({
	providers: [EmailEmailVerificationServiceProvider],
	exports:[EmailEmailVerificationServiceProvider]
})
export class EmailVerificationModule {}
