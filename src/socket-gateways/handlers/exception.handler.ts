import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseWsExceptionFilter } from "@nestjs/websockets";

@Catch()
export class WsExceptionsFilter extends BaseWsExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		console.log("error");
		super.catch(exception, host);
	}
}