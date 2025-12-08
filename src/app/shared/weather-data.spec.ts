import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { WeatherData } from './weather-data';
import { provideZonelessChangeDetection } from '@angular/core';

describe('WeatherData', () => {
  let service: WeatherData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        WeatherData,
      ],
    });
    service = TestBed.inject(WeatherData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
