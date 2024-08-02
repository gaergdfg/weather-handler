import { Module } from '@nestjs/common';

import { WeatherGateway } from './weather.gateway';

@Module({
  providers: [WeatherGateway],
})
export class WeatherModule {}
