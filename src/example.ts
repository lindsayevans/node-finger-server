import { FingerDaemon, ListRequest, UserRequest } from './finger-server';
import { exampleUsers } from './exampleUsers';

import Table from 'table-layout';

// Host & port to listen on
const HOST = process.env.FINGER_HOST || 'localhost';
const PORT = process.env.FINGER_PORT || '79';

// Create finger daemon
const fing = new FingerDaemon({ logger: console });

// Handle list requests
fing.on('list', async (r: ListRequest) => {
  console.log('List request');
  console.log(r);

  return new Table(
    (r.verbose
      ? exampleUsers
      : exampleUsers.map((x) => ({
          username: x.username,
          name: x.name,
        }))) as any
  ).toString();
});

// Handle user requests
fing.on('user', async (r: UserRequest) => {
  console.log('User request');
  console.log(r);

  const user = exampleUsers.find((x) => x.username === r.username);
  if (!user) {
    return `User ${r.username} not found`;
  }

  return new Table(
    (r.verbose
      ? [user]
      : [user].map((x) => ({ username: x.username, name: x.name }))) as any
  ).toString();
});

// Start listening for requests
fing.listen(HOST, Number(PORT), () => {
  console.log('Listening on ' + HOST + ':' + PORT);
});
