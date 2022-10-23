import { Inject } from "@nestjs/common";


export const InjectAccessJwtService =  (target: object, propertyKey: string, parameterIndex: number) => {
	const injectService = Inject("AccessJwtService");
	return injectService(target, propertyKey, parameterIndex);
}