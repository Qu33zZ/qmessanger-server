import {  Inject } from "@nestjs/common";


export const InjectUserService =  (target: object, propertyKey: string, parameterIndex: number) => {
	const injectService = Inject("UserService");
	return injectService(target, propertyKey, parameterIndex);
}