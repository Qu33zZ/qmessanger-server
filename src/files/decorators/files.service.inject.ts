import { Inject } from "@nestjs/common";


export const InjectFilesService =  (target: object, propertyKey: string, parameterIndex: number) => {
	const injectService = Inject("FilesService");
	return injectService(target, propertyKey, parameterIndex);
}