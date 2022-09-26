import { Test, TestingModule } from '@nestjs/testing';
import { SocketGatewaysService } from './socket-gateways.service';

describe('SocketGatewaysService', () => {
  let service: SocketGatewaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketGatewaysService],
    }).compile();

    service = module.get<SocketGatewaysService>(SocketGatewaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
