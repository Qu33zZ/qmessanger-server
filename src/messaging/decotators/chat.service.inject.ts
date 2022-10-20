import { Inject } from "@nestjs/common";


export const InjectMessagingService =  (target: object, propertyKey: string, parameterIndex: number) => {
	const injectService = Inject("MessagingService");
	return injectService(target, propertyKey, parameterIndex);
}