import { Injectable, Provider } from "@nestjs/common";
import { ServicesInjectTokens } from "../services.inject.tokens";

@Injectable()
export class SocketGatewaysService {


}


export const SocketGatewaysServiceProvider:Provider = {
	provide:ServicesInjectTokens.SocketGatewaysService,
	useClass:SocketGatewaysService
};