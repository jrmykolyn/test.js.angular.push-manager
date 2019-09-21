self.addEventListener('push', (event) => {
  console.log('__ RECEIVED PUSH EVENT');
  console.log(event);
});
