import {
  ArgumentMetadata,
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { io, Socket } from 'socket.io-client';

import { WeatherDataDto } from './dto/weather-data.dto';
import { AppModule } from '../app.module';
import { Weather, WeatherSchema } from '../schemas';
import { WeatherGateway } from './weather.gateway';
import { WeatherService } from './weather.service';

const TEST_PORT = 3001;

describe('WeatherGateway', () => {
  let app: INestApplication;
  let mongodb: MongoMemoryServer;
  let socket: Socket;
  let weatherModel: Model<Weather>;

  beforeAll(async () => {
    mongodb = new MongoMemoryServer();
    await mongodb.start();
    const uri = await mongodb.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: Weather.name, schema: WeatherSchema },
        ]),
        AppModule,
      ],
      providers: [WeatherGateway, WeatherService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.listen(TEST_PORT);

    socket = io(`http://localhost:${TEST_PORT}`);

    weatherModel = moduleFixture.get<Model<Weather>>(
      getModelToken(Weather.name),
    );
  });

  afterAll(async () => {
    socket.close();
    await app.close();
    await mongodb.stop();
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
    await validationPipe.transform(invalidData, metadata).catch((err) => {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err).toHaveProperty('response');
      expect(err.response).toHaveProperty('message');
      expect(err.response.message).toContain(
        'temperature must be a number conforming to the specified constraints',
      );
      expect(err.response.message).toContain(
        'humidity must be a number conforming to the specified constraints',
      );
    });
  });

  it('create entity in db', (done) => {
    const weatherData: WeatherDataDto = { temperature: 25, humidity: 70 };

    expect.assertions(3);
    socket.emit('weather-data', weatherData, async () => {
      const createdWeather = await weatherModel
        .findOne({ temperature: weatherData.temperature })
        .exec();
      expect(createdWeather).not.toBeNull();
      expect(createdWeather.temperature).toBe(weatherData.temperature);
      expect(createdWeather.humidity).toBe(weatherData.humidity);

      done();
    });
  });

  it('return entity data', (done) => {
    const weatherData: WeatherDataDto = { temperature: 40, humidity: 230 };

    expect.assertions(2);
    socket.emit('weather-data', weatherData, async (response) => {
      expect(response.temperature).toBe(weatherData.temperature);
      expect(response.humidity).toBe(weatherData.humidity);

      done();
    });
  });
});
