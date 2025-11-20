import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WeatherData {
  getUrl = 'https://open-meteo.com';

  constructor(private http: HttpClient) {}

  getWeatherData() {
    return this.http
      .get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: '52.52',
          longitude: '13.41',
          hourly: 'temperature_2m',
        },
      })
      .subscribe({
        next: (data) => console.log('Weather:', data),
        error: (err) => console.error(err),
      });
  }
}
