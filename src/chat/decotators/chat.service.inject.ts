import {  Inject } from "@nestjs/common";


export const InjectChatService =  (target: object, propertyKey: string, parameterIndex: number) => {
	const injectService = Inject("ChatService");
	return injectService(target, propertyKey, parameterIndex);
}