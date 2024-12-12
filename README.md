# finger-server

Implementation of a finger daemon for NodeJS

https://en.wikipedia.org/wiki/Finger_(protocol)
https://datatracker.ietf.org/doc/html/rfc742
https://datatracker.ietf.org/doc/html/rfc1288

Example in [`src/example.ts`](./src/example.ts)

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
