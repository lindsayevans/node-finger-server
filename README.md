# finger-server

Implementation of a [finger daemon](<https://en.wikipedia.org/wiki/Finger_(protocol)>) for NodeJS

## Usage

```sh
npm i @querc/finger-server
```

Basic example:

```ts
import { FingerDaemon } from '@querc/finger-server';

const fd = new FingerDaemon();

fd.on('list', (req) => {
  return '[list of users]';
});

fd.on('user', (req) => {
  return '[user details]';
});

fd.listen();
```

See full example in [`src/example.ts`](./src/example.ts)

```sh
sudo pnpm start:example
```

```sh
# List users:
finger @localhost
# Get user 'alice':
finger alice@localhost
# Verbose:
finger -l @localhost
finger -l charles@localhost
```
