# Semantic Release Template for MSP Node Libraries

Use this template for all MSP node libraries to ensure consistent release management.

## Required Files

### 1. `.releaserc.json`

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/changelog", {
      "changelogFile": "CHANGELOG.md"
    }],
    ["@semantic-release/npm", {
      "npmPublish": true
    }],
    ["@semantic-release/git", {
      "assets": ["package.json", "CHANGELOG.md"],
      "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
    }],
    "@semantic-release/github"
  ]
}
```

### 2. `.github/workflows/release.yml`

```yaml
name: Release

on:
  push:
    branches:
      - main

permissions:
  contents: write
  issues: write
  pull-requests: write
  packages: write

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://npm.pkg.github.com'
          scope: '@asachs01'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run tests
        run: npm test

      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx semantic-release
```

### 3. `.npmrc`

```
@asachs01:registry=https://npm.pkg.github.com
```

### 4. `package.json` Updates

Add scoped name and publishConfig:

```json
{
  "name": "@asachs01/PACKAGE_NAME",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

## Package Names

| Library | Scoped Package Name |
|---------|-------------------|
| node-syncro | @asachs01/node-syncro |
| node-atera | @asachs01/node-atera |
| node-superops | @asachs01/node-superops |
| node-halopsa | @asachs01/node-halopsa |
| node-it-glue | @asachs01/node-it-glue |
| node-datto-rmm | @asachs01/node-datto-rmm |

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature (minor version bump)
- `fix:` - Bug fix (patch version bump)
- `docs:` - Documentation only
- `ci:` - CI/CD changes
- `chore:` - Maintenance tasks
- `BREAKING CHANGE:` in footer - Major version bump
