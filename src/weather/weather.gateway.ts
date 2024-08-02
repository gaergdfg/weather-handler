import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { WeatherDataDto } from './dto/weather-data.dto';

@WebSocketGateway()
export class WeatherGateway {
  @SubscribeMessage('weather-data')
  @UsePipes(new ValidationPipe({ transform: true }))
  async onWeatherData(@MessageBody() data: WeatherDataDto) {
    // TODO: save data to database
    return null;
  }
}
