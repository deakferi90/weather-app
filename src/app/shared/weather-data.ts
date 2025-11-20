import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class WeatherData {
  private http = inject(HttpClient);

  city = signal('');
  country = signal('');
  temperature = signal<number | null>(null);

  async getCityWeather(name: string) {
    // 1️⃣ Get coordinates + country
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

    // 2️⃣ Fetch today's temperature
    const weather: any = await this.http
      .get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: result.latitude,
          longitude: result.longitude,
          current: 'temperature_2m',
          timezone: 'auto',
        },
      })
      .toPromise();

    this.temperature.set(weather.current.temperature_2m);
  }
}
