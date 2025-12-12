import { createReducer, on } from '@ngrx/store';
import type { WeatherState } from './weather.state';
import * as WeatherActions from './weather.actions';
import {
  buildHourlyStartingNow,
  buildDailyForecast,
  mapWeatherCodeToIcon,
  getClosestHourly,
} from './weather.utils';

export const initialState: WeatherState = {
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

export const weatherReducer = createReducer(
  initialState,

  on(WeatherActions.loadWeather, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(WeatherActions.loadWeatherSuccess, (state, { weather }) => {
    const current = {
      temperature: weather.current.temperature_2m,
      feelsLike: weather.current.apparent_temperature,
      humidity: weather.current.relative_humidity_2m,
      wind: weather.current.wind_speed_10m,
      precipitation: getClosestHourly(weather),
      time: weather.current.time,
      weatherCode: weather.current.weather_code,
      weatherIcon: mapWeatherCodeToIcon(weather.current.weather_code),
    };

    const { hoursByDay, hourlyDays } = buildHourlyStartingNow(weather);
    const dailyForecast = buildDailyForecast(weather);

    return {
      ...state,
      city: weather.city,
      country: weather.country,
      timezone: weather.timezone,
      current,
      hourlyForecast: hoursByDay, // ✔ Record<string, any[]>
      hourlyDays, // ✔ string[]
      dailyForecast,
      selectedDay: hourlyDays[0] ?? null,
      loading: false,
      error: null,
    };
  }),

  on(WeatherActions.loadWeatherFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(WeatherActions.selectDay, (state, { day }) => ({
    ...state,
    selectedDay: day,
  }))
);
