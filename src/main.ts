import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/**
 * Bootstrap the Angular application
 * Loads the root AppComponent with the application configuration
 */
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
