export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  feelsLikeMax: number;
  feelsLikeMin: number;
  precipitation: number;
  windMax: number;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  precipitation: number;
  time: string;
}

export interface WeatherResponse {
  city: string;
  country: string;
  timezone: string;
  current: CurrentWeather;
  daily: DailyForecast[];
}
