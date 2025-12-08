import { Component, inject, OnInit } from '@angular/core';
import { WeatherData } from '../shared/weather-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-display-weather',
  imports: [CommonModule],
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
