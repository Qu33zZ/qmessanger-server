import { Test, TestingModule } from '@nestjs/testing';
import { SocketGatewaysGateway } from './socket-gateways.gateway';
import { SocketGatewaysService } from './socket-gateways.service';

describe('SocketGatewaysGateway', () => {
	let gateway: SocketGatewaysGateway;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [SocketGatewaysGateway, SocketGatewaysService],
		}).compile();

		gateway = module.get<SocketGatewaysGateway>(SocketGatewaysGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
