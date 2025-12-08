import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideZonelessChangeDetection } from '@angular/core';

const isProduction = true;

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    ...(isProduction ? [provideZonelessChangeDetection()] : []),
  ],
}).catch((err) => console.error(err));
