# finger-server

https://datatracker.ietf.org/doc/html/rfc742
https://datatracker.ietf.org/doc/html/rfc1288

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

```sh
pnpm test:watch
```
