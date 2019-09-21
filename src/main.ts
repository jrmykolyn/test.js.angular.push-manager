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

      // Request push notification permission, passing in the public VAPID key.
      serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "BM0iVtYTuEGGCzJTufYOGcBrV101gIRuRzt5Q7Y1VsX47C3n-shwhz1CU6UfwH2Ij_QqAArjJhkNm0-onTUAh7o",
      }).then((subscription) => {
        const target = document.querySelector('pre');
        if (target) {
          target.innerHTML = JSON.stringify(subscription, null, 2);
        }
      })
      .catch((err) => {
        console.error('__ WHOOPS, FAILED TO RETRIEVE SUBSCRIPTION DATA');
        console.error(err);
      });
    })
    .catch((err) => {
      console.error('__ WHOOPS, SOMETHING WENT WRONG!');
      console.error(err);
    });
}
