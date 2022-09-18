import { Module } from '@nestjs/common';
import { SmsService, SmsServiceAws } from "./sms.service";

@Module({
	providers: [{
		provide:SmsServiceAws,
		useClass:SmsServiceAws
	}],
	exports:[SmsServiceAws]
})
export class SmsModule {}
