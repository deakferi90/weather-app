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
  relativeHumidity = signal<number | null>(null);
  precipitation = signal<number | null>(null);
  wind = signal<number | null>(null);
  timezone = signal<string | null>(null);
  dateFormatted = signal<string>('');
  private datePipe = new DatePipe('en-US');
  constructor() {}

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
    console.log(result);
    this.city.set(result.name);
    this.country.set(result.country);

    const weather: any = await this.http
      .get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: result.latitude,
          longitude: result.longitude,
          current:
            'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation',
          timezone: 'auto',
        },
      })
      .toPromise();

    this.temperature.set(weather.current.temperature_2m);
    this.apparentTemperature.set(weather.current.apparent_temperature);
    this.relativeHumidity.set(weather.current.relative_humidity_2m);
    this.wind.set(weather.current.wind_speed_10m);
    this.precipitation.set(weather.current.precipitation);
    this.timezone.set(weather.timezone);
    const localDate = new Date(weather.current.time);
    this.dateFormatted.set(
      this.datePipe.transform(localDate, 'EEEE, MMM dd yyyy', weather.timezone)!
    );
  }
}
