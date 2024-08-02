import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { WeatherDataDto } from './dto/weather-data.dto';
import { Weather, WeatherDocument } from '../schemas';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
  ) {}

  async create(weatherData: WeatherDataDto) {
    const entry = new this.weatherModel(weatherData);
    return entry.save();
  }
}
