import { Inject } from "@nestjs/common";


export const InjectJwtService =  (target: object, propertyKey: string, parameterIndex: number) => {
	const injectService = Inject("JwtService");
	return injectService(target, propertyKey, parameterIndex);
}