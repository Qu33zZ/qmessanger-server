import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
	const PORT = Number(process.env.PORT || 3001);
	const app = await NestFactory.create(AppModule);
	app.enableCors({origin:["http://localhost:3000"], credentials:true});
	app.setGlobalPrefix("api");
	app.use(cookieParser());
	await app.listen(PORT, () => {
		console.log(`Server successfully started on port ${PORT}`);
	});
}
bootstrap();
