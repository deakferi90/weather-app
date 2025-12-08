import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayWeather } from './display-weather';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { WeatherData } from '../shared/weather-data';
import { provideZonelessChangeDetection } from '@angular/core';

describe('DisplayWeather', () => {
  let component: DisplayWeather;
  let fixture: ComponentFixture<DisplayWeather>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayWeather, CommonModule],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        WeatherData,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayWeather);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
