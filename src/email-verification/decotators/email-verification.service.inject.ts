import {  Inject } from "@nestjs/common";


export const InjectEmailVerificationService =  (target: object, propertyKey: string, parameterIndex: number) => {
	const injectService = Inject("EmailVerificationService");
	return injectService(target, propertyKey, parameterIndex);
}