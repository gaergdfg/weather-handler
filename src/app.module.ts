import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.DATABASE_URI), WeatherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
