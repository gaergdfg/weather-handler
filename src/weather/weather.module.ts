import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WeatherGateway } from './weather.gateway';
import { WeatherService } from './weather.service';
import { Weather, WeatherSchema } from '../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Weather.name, schema: WeatherSchema }]),
  ],
  providers: [WeatherGateway, WeatherService],
})
export class WeatherModule {}
