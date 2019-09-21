self.addEventListener('push', (event) => {
  console.log('__ RECEIVED PUSH EVENT');
  if (event.data) {
    const data = event.data.json();
    this.registration.showNotification(
      (data.title || 'Default Title')
    );
  }
});
