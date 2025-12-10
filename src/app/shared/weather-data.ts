import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class WeatherData {
  private http = inject(HttpClient);
  private datePipe = new DatePipe('en-US');

  // Current data
  city = signal('');
  country = signal('');
  temperature = signal<number | null>(null);
  apparentTemperature = signal<number | null>(null);
  weatherCode = signal<number | null>(null);
  relativeHumidity = signal<number | null>(null);
  precipitation = signal<number | null>(null);
  wind = signal<number | null>(null);
  timezone = signal<string | null>(null);
  dateFormatted = signal('');
  shortDayName = signal('');
  weatherIcon = signal('');

  // Forecasts
  hourlyForecast = signal<any[]>([]);
  dailyForecast = signal<any[]>([]);

  private weatherCodeToIcon: Record<number, string> = {
    0: 'assets/sunny.png',
    1: 'assets/cloudy_sunny.png',
    2: 'assets/cloudy_sunny.png',
    3: 'assets/cloudy.png',
    45: 'assets/fog.png',
    48: 'assets/fog.png',
    51: 'assets/cloudy_sunny.png',
    53: 'assets/cloudy_sunny.png',
    55: 'assets/cloudy_sunny.png',
    61: 'assets/cloudy.png',
    63: 'assets/cloudy.png',
    65: 'assets/cloudy.png',
    66: 'assets/cloudy.png',
    67: 'assets/cloudy.png',
    71: 'assets/snow.png',
    73: 'assets/snow.png',
    75: 'assets/snow.png',
    77: 'assets/snow.png',
    80: 'assets/cloudy.png',
    81: 'assets/cloudy.png',
    82: 'assets/cloudy.png',
    85: 'assets/snow.png',
    86: 'assets/snow.png',
    95: 'assets/storm.png',
    96: 'assets/storm.png',
    99: 'assets/storm.png',
  };

  async getCityWeather(name: string) {
    const geo: any = await this.http
      .get('https://geocoding-api.open-meteo.com/v1/search', {
        params: { name },
      })
      .toPromise();

    if (!geo?.results?.length) throw new Error('City not found');

    const result = geo.results[0];

    this.city.set(result.name);
    this.country.set(result.country);

    const weather: any = await this.http
      .get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: result.latitude,
          longitude: result.longitude,
          current:
            'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
          hourly: 'temperature_2m,precipitation,weather_code',
          daily:
            'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
          timezone: 'auto',
        },
      })
      .toPromise();

    // Set current data
    this.temperature.set(weather.current.temperature_2m);
    this.apparentTemperature.set(weather.current.apparent_temperature);
    this.relativeHumidity.set(weather.current.relative_humidity_2m);
    this.weatherCode.set(weather.current.weather_code);
    this.wind.set(weather.current.wind_speed_10m);
    this.timezone.set(weather.timezone);

    // Precipitation (closest hour)
    this.precipitation.set(this.getClosestHourly(weather));

    // Date
    const date = new Date(weather.current.time);
    const fullDate = this.dateFormatted.set(
      this.datePipe.transform(date, 'EEEE, MMM dd yyyy', weather.timezone)!
    );

    const fullD = this.datePipe.transform(
      date,
      'EEEE, MMM dd yyyy',
      weather.timezone
    )!;

    const shorenedDayName = fullD.substring(0, 3);
    this.shortDayName.set(shorenedDayName);

    // Icon
    this.weatherIcon.set(this.weatherCodeToIcon[weather.current.weather_code]);

    // Hourly forecast
    const hourly = weather.hourly.time.map((t: string, i: number) => ({
      time: t,
      temp: weather.hourly.temperature_2m[i],
      precipitation: weather.hourly.precipitation[i],
      code: weather.hourly.weather_code[i],
      icon: this.weatherCodeToIcon[weather.hourly.weather_code[i]],
    }));
    this.hourlyForecast.set(hourly.slice(0, 24));

    // Daily forecast
    const daily = weather.daily.time.map((t: string, i: number) => ({
      date: t,
      max: weather.daily.temperature_2m_max[i],
      min: weather.daily.temperature_2m_min[i],
      precipitation: weather.daily.precipitation_sum[i],
      code: weather.daily.weather_code[i],
      icon: this.weatherCodeToIcon[weather.daily.weather_code[i]],
    }));
    this.dailyForecast.set(daily);
  }

  private getClosestHourly(weather: any): number {
    const current = new Date(weather.current.time);

    let closestIndex = 0;
    let smallestDiff = Infinity;

    for (let i = 0; i < weather.hourly.time.length; i++) {
      const t = new Date(weather.hourly.time[i]);
      const diff = Math.abs(t.getTime() - current.getTime());
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestIndex = i;
      }
    }

    return weather.hourly.precipitation[closestIndex];
  }
}
