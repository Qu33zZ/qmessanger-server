import { ArgumentsHost, Catch, HttpStatus, WsExceptionFilter } from "@nestjs/common";
import { Socket } from "socket.io";
import { WsException } from "@nestjs/websockets";

@Catch(WsException)
export class WsExceptionsFilter implements WsExceptionFilter{
	catch(exception: WsException, host: ArgumentsHost) {
		console.log("error");
		const ctx = host.switchToWs();
		const client = ctx.getClient<Socket>();
		const error = exception.getError();

		client.emit("error", error);
	}
}