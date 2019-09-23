import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

const getId = () => {
  const a = [];
  a.push(window.navigator.userAgent);
  return a.join(':');
};

// Ensure that service workers are supported in the current browser.
if ('navigator' in window && 'serviceWorker' in window.navigator) {

  window.fetch('http://localhost:4600/keys')
    .then((response) => {
      return response.json();
    })
    .then((keys) => {
      const [{ publicKey }] = keys;
      window['__APPLICATION_SERVER_KEY__'] = publicKey;

      // Register the application service worker, exposing the service worker
      // reference.
      return window.navigator.serviceWorker.register('/assets/service-worker.js');
    })
    .then((serviceWorker) => {

      // Request push notification permission, passing in the public VAPID key.
      return serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "BM0iVtYTuEGGCzJTufYOGcBrV101gIRuRzt5Q7Y1VsX47C3n-shwhz1CU6UfwH2Ij_QqAArjJhkNm0-onTUAh7o",
      });
    })
    .then((subscription) => {

      // Bundle the subscription data and a computed ID that corresponds to
      // the user's device into a new object; add data to DOM.
      const target = document.querySelector('pre');
      const data = {
        id: getId(),
        subscription,
      };

      if (!target) {
        return Promise.reject(new Error('Document does not contain elem.'));
      }

      target.innerHTML = JSON.stringify(data, null, 2);
      return window.fetch('http://localhost:4600/subscriptions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    })
    .catch((err) => {
      console.error('__ WHOOPS, FAILED TO RETRIEVE SUBSCRIPTION DATA');
      console.error(err);
    });
}
