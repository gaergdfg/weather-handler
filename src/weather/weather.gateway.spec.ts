import { ArgumentMetadata, BadRequestException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { WeatherGateway } from './weather.gateway';
import { WeatherDataDto } from './dto/weather-data.dto';

describe.only('WeatherGateway', () => {
  // let gateway: WeatherGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherGateway],
    }).compile();

    // gateway = module.get<WeatherGateway>(WeatherGateway);
  });

  it('invalid data format', async () => {
    const invalidData = { temperature: 'invalid', humidity: 'invalid' };

    const validationPipe = new ValidationPipe({ transform: true });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: WeatherDataDto,
      data: '',
    };

    expect.assertions(5);
    await validationPipe.transform(invalidData, metadata)
      .catch(err => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err).toHaveProperty('response');
        expect(err.response).toHaveProperty('message');
        expect(err.response.message).toContain('temperature must be a number conforming to the specified constraints');
        expect(err.response.message).toContain('humidity must be a number conforming to the specified constraints');
      });
  });
});
