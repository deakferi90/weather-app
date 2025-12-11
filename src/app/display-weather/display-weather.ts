import { Component, inject } from '@angular/core';
import { WeatherData } from '../shared/weather-data';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-display-weather',
  imports: [CommonModule, FormsModule],
  templateUrl: './display-weather.html',
  styleUrls: ['./display-weather.scss'],
})
export class DisplayWeather {
  bgPic = 'assets/bg-picture.png';
  sharedService = inject(WeatherData);

  constructor() {}

  lookup(city: string) {
    this.sharedService.getCityWeather(city);
  }
}
