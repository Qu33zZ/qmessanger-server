import { Module } from '@nestjs/common';
import { ChatServiceProvider } from "./chat.service";
import { ChatController } from './chat.controller';

@Module({
	controllers: [ChatController],
	providers: [ChatServiceProvider]
})
export class ChatModule {}
