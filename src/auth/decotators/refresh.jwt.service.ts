import { Inject } from "@nestjs/common";


export const InjectRefreshJwtService =  (target: object, propertyKey: string, parameterIndex: number) => {
	const injectService = Inject("RefreshJwtService");
	return injectService(target, propertyKey, parameterIndex);
}