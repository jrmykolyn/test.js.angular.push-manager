self.addEventListener('push', (event) => {
  console.log('__ RECEIVED PUSH EVENT');
  if (event.data) {
    const data = (event.data.json() || {});
    const { title = 'Default Title', options = {} } = data;

    this.registration.showNotification(
      title,
      options
    );
  }
});
