import { WsException } from "@nestjs/websockets";
import { HttpStatus } from "@nestjs/common";

export class WsUnauthorizedException extends WsException {
	constructor() {
		super({message:"Invalid authorization token", status:HttpStatus.UNAUTHORIZED});
	}
}