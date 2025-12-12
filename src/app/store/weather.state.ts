export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  precipitation: number;
  time: string;
  weatherCode: number;
  weatherIcon: string;
}

export interface DailyForecast {
  date: string;
  max: number;
  min: number;
  precipitation: number;
  code: number;
  icon: string;
}

export interface WeatherState {
  city: string;
  country: string;
  timezone: string;
  current: CurrentWeather | null;
  hourlyForecast: Record<string, any[]>; // { 'YYYY-MM-DD': [hour objects] }
  hourlyDays: string[];
  dailyForecast: DailyForecast[];
  selectedDay: string | null;
  loading: boolean;
  error: string | null;
}

export const initialWeatherState: WeatherState = {
  city: '',
  country: '',
  timezone: '',
  current: null,
  hourlyForecast: {},
  hourlyDays: [],
  dailyForecast: [],
  selectedDay: null,
  loading: false,
  error: null,
};
