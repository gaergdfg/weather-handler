import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { WeatherDataDto } from './dto/weather-data.dto';
import { WeatherService } from './weather.service';

@WebSocketGateway()
export class WeatherGateway {
  constructor(private readonly weatherService: WeatherService) {}

  @SubscribeMessage('weather-data')
  @UsePipes(new ValidationPipe({ transform: true }))
  async onWeatherData(@MessageBody() data: WeatherDataDto) {
    return await this.weatherService.create(data);
  }
}
