import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../app/header/header';
import { DisplayWeather } from './display-weather/display-weather';

@Component({
  selector: 'app-root',
  imports: [Header, DisplayWeather],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('weather-app');
}
