import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	return Reflect.getMetadata("user", ctx.getHandler());
});