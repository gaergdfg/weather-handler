import { IsNumber } from 'class-validator';

export class WeatherDataDto {
  @IsNumber()
  temperature: number;

  @IsNumber()
  humidity: number;
}
