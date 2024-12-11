import { FingerDaemon } from './finger-server/daemon/FingerDaemon';

// Host & port to listen on
const HOST = process.env.FINGER_HOST || 'localhost';
const PORT = process.env.FINGER_PORT || '79';

// Create finger daemon
const fing = new FingerDaemon({ logger: console });

// Handle list requests
fing.on('list', async (r) => {
  console.log('List request');
  console.log(r);

  return 'nope';
});

// Handle user requests
fing.on('user', async (r) => {
  console.log('User request');
  console.log(r);

  return `Here's the goss on ${r.username}`;
});

// Start listening for requests
fing.listen(HOST, Number(PORT), () => {
  console.log('Listening on ' + HOST + ':' + PORT);
});

// Shutdown gracefully
process.on('SIGTERM', async () => {
  await fing.shutdown();
  process.exit();
});
