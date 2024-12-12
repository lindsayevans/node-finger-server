# Release process

## Beta

```sh
pnpm version prerelease --preid=next
pnpm build
pnpm publish --no-git-checks --access public --tag next
```

## Production

Create new release in git-flow

Bump version:

```sh
pnpm version patch
pnpm version minor
```

Push/merge to `main` branch will trigger CI/CD workflow, which publishes `@querc/finger-server@VERSION` & creates a GitHub release
