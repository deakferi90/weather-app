import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class WeatherData {
  private http = inject(HttpClient);

  city = signal('');
  country = signal('');
  temperature = signal<number | null>(null);
  apparentTemperature = signal<number | null>(null);
  weatherCode = signal<null | number>(null);
  relativeHumidity = signal<number | null>(null);
  precipitation = signal<number | null>(null);
  wind = signal<number | null>(null);
  timezone = signal<string | null>(null);
  dateFormatted = signal<string>('');
  weatherIcon = signal<string>('');
  private datePipe = new DatePipe('en-US');
  constructor() {}

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

  formatDate(date: Date): string | null {
    return this.datePipe.transform(date, 'short');
  }

  async getCityWeather(name: string) {
    const geo: any = await this.http
      .get('https://geocoding-api.open-meteo.com/v1/search', {
        params: { name },
      })
      .toPromise();

    if (!geo || !geo.results || geo.results.length === 0) {
      throw new Error('City not found');
    }

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
          hourly: 'precipitation',
          timezone: 'auto',
        },
      })
      .toPromise();

    this.temperature.set(weather.current.temperature_2m);
    this.weatherCode.set(weather.current.weather_code);
    this.apparentTemperature.set(weather.current.apparent_temperature);
    this.relativeHumidity.set(weather.current.relative_humidity_2m);
    this.wind.set(weather.current.wind_speed_10m);
    const current = new Date(weather.current.time);

    let closestIndex = 0;
    let smallestDiff = Infinity;

    for (let i = 0; i < weather.hourly.time.length; i++) {
      const time = new Date(weather.hourly.time[i]);
      const diff = Math.abs(time.getTime() - current.getTime());
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestIndex = i;
      }
    }

    this.precipitation.set(weather.hourly.precipitation[closestIndex]);

    const icon =
      this.weatherCodeToIcon[weather.current.weather_code] ||
      'assets/sunny.png';
    this.weatherIcon.set(icon);

    const localDate = new Date(weather.current.time);
    this.dateFormatted.set(
      this.datePipe.transform(localDate, 'EEEE, MMM dd yyyy', weather.timezone)!
    );
  }
}
