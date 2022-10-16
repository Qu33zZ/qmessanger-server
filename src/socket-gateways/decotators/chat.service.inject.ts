import { Inject } from "@nestjs/common";


export const InjectWebsocketService =  (target: object, propertyKey: string, parameterIndex: number) => {
	const injectService = Inject("WebsocketService");
	return injectService(target, propertyKey, parameterIndex);
}