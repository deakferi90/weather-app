import { Component, inject, OnInit } from '@angular/core';
import { WeatherData } from '../shared/weather-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-display-weather',
  imports: [CommonModule],
  templateUrl: './display-weather.html',
  styleUrl: './display-weather.scss',
})
export class DisplayWeather implements OnInit {
  bgPic = 'assets/bg-picture.png';
  sharedService = inject(WeatherData);

  constructor() {}

  ngOnInit(): void {
    this.displayTimeZone();
  }

  lookup(city: string) {
    this.sharedService.getCityWeather(city);
  }

  displayTimeZone() {
    console.log(this.sharedService.dateFormatted);
  }
}
