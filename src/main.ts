import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// Ensure that service workers are supported in the current browser.
if ('navigator' in window && 'serviceWorker' in window.navigator) {

  // Register the application service worker, exposing the service worker
  // reference.
  window.navigator.serviceWorker.register('/assets/service-worker.js')
    .then((serviceWorker) => {
      // TODO: Request permission for push notiifactions.
    })
    .catch((err) => {
      console.error('__ WHOOPS, SOMETHING WENT WRONG!');
      console.error(err);
    });
}
