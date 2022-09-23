import { Injectable, Provider } from '@nestjs/common';
import { ServicesInjectTokens } from "../services.inject.tokens";

@Injectable()
export class ChatService {}


export const ChatServiceProvider:Provider ={
	provide:ServicesInjectTokens.ChatService,
	useClass:ChatService
}
