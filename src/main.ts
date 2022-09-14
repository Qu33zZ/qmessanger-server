import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "dotenv/config";

async function bootstrap() {
	const PORT = Number(process.env.PORT || 3001);
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix("api");
	await app.listen(PORT, () => {
		console.log(`Server successfully started on port ${PORT}`);
	});
}
bootstrap();
