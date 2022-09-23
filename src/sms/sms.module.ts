import { Module } from '@nestjs/common';
import { SmsServiceProvider } from "./sms.service";

@Module({
	providers: [SmsServiceProvider],
	exports:[SmsServiceProvider]
})
export class SmsModule {}
