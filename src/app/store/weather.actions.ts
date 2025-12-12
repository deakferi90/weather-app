import { createAction, props } from '@ngrx/store';

export const loadWeather = createAction(
  '[Weather] Load Weather',
  props<{ cityName: string }>()
);

export const loadWeatherSuccess = createAction(
  '[Weather] Load Weather Success',
  props<{ weather: any }>()
);

export const loadWeatherFailure = createAction(
  '[Weather] Load Weather Failure',
  props<{ error: string }>()
);

export const selectDay = createAction(
  '[Weather] Select Day',
  props<{ day: string }>()
);
