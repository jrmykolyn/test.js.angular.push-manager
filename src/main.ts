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

  // 1.
  // Fetch the public VAPID key.
  window.fetch('http://localhost:4600/keys')
    .then((response) => {
      return response.json();
    })
    // 2.
    // Expose the parsed VAPID key as a property of the window.
    // Register the application service worker.
    .then((keys) => {
      const [{ publicKey }] = keys;
      window['__APPLICATION_SERVER_KEY__'] = publicKey;
      return window.navigator.serviceWorker.register('/assets/service-worker.js');
    })
    // 3.
    // Request push notification permission using the service worker reference
    // and the VAPID key.
    .then((serviceWorker) => {
      return serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: window['__APPLICATION_SERVER_KEY__'],
      });
    })
    // 4.
    // Compute an identifier for the current user/user's device.
    // Bundle subscription data and computed ID.
    // Display subscription data and computed ID via the DOM.
    .then((subscription) => {
      const target = document.querySelector('pre');
      const data = { id: getId(), subscription };

      if (!target) {
        return Promise.reject(new Error('Document does not contain elem.'));
      }

      target.innerHTML = JSON.stringify(data, null, 2);

      return new Promise((resolve) => resolve(data));
    })
    // 5.
    // Send subscription data to back-end so that it can be persisted.
    .then((data) => {
      return window.fetch('http://localhost:4600/subscriptions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    })
    // 6.
    // Handle errors, including:
    // - Failure to register service worker.
    // - Failure to extract subscription data.
    // - Failure to display subscription data.
    // - Failed to POST subscription data.
    .catch((err) => {
      console.error('__ WHOOPS, SOMETHING WENT WRONG!');
      console.error(err);
    });
}
