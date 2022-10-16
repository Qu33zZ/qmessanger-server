import {  Inject } from "@nestjs/common";


export const InjectAuthService =  (target: object, propertyKey: string, parameterIndex: number) => {
	const injectService = Inject("AuthService");
	return injectService(target, propertyKey, parameterIndex);
}