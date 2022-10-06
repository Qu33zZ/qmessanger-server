import { Injectable, Provider } from "@nestjs/common";
import axios from "axios";
import { SNS } from "aws-sdk";
import "dotenv/config";
import { ServicesInjectTokens } from "../services.inject.tokens";
import { ISmsService } from "./interfaces/ISms.service";

@Injectable()
export class SmsService implements ISmsService {
	async sendMessage(text: string, phoneNumbers: string): Promise<any> {
		const options = {
			method: "POST",
			url: "https://d7sms.p.rapidapi.com/messages/v1/send",
			headers: {
				"content-type": "application/json",
				Token: "undefined",
				"X-RapidAPI-Key": "820b916defmsh941f3dbcd8ed24ap17ee71jsn098fd23d999f",
				"X-RapidAPI-Host": "d7sms.p.rapidapi.com",
			},
			data: {
				messages: [
					{ channel: "sms", originator: "SMS", recipients: phoneNumbers, content: text, msg_type: "text" },
				],
			},
		};
		const response = await axios.request(options);
		return response;
	}
}

@Injectable()
export class SmsServiceAws implements ISmsService {
	async sendMessage(text: string, phoneNumber: string): Promise<any> {
		const params: SNS.PublishInput = {
			Message: text,
			PhoneNumber: phoneNumber,
			MessageAttributes: {
				"AWS.SNS.SMS.SenderID": {
					DataType: "String",
					StringValue: "QMESSANGER",
				},
			},
		};

		const publishTextResult = await new SNS({ apiVersion: "2010-03-31" }).publish(params).promise();
		return publishTextResult;
	}
}

export const SmsServiceProvider: Provider = {
	provide: ServicesInjectTokens.SmsService,
	useClass: SmsServiceAws,
};
