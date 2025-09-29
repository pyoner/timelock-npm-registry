# TimeLock NPM Registry

**TimeLock NPM Registry** is an alternative npm package registry focused on supply chain security.

Its core feature is introducing a **time lock** before new package versions become available for installation.
This protects developers from compromised releases: while packages are “on hold,” the community and security tools have time to detect and block malicious code.

## Why it matters

- 📦 Reduces the risk of installing malicious packages.
- ⏳ Lets you “wait out” 24 hours or more before updating.
- 🔒 Increases trust in dependencies and builds.

## How it works

1. A package author publishes a new version.
2. TimeLock NPM Registry places it into a pending state for a set duration (e.g., 24 hours).
3. Only after the timer expires does the package become available for installation.

## How to Use

To use the TimeLock NPM Registry, you need to configure your package manager to point to the registry's URL. The URL format is `https://<your-worker-url>/lock/<minutes>/`, where `<minutes>` is your desired time lock.

For example, to set a 24-hour (1440 minutes) time lock, the URL would be:
`https://<your-worker-url>/lock/1440/`

Replace `<your-worker-url>` with the actual URL of your deployed Cloudflare Worker.

### Configuration

#### npm & pnpm

For both `npm` and `pnpm`, you can configure the registry on a per-project basis by creating a `.npmrc` file in your project's root directory with the following content:

```
registry=https://<your-worker-url>/lock/1440/
```

Alternatively, you can set the configuration globally:

**For npm:**

```bash
npm config set registry https://<your-worker-url>/lock/1440/
```

**For pnpm:**

```bash
pnpm config set registry https://<your-worker-url>/lock/1440/
```

To revert to the default npm registry, run:
`npm config set registry https://registry.npmjs.org/` or `pnpm config set registry https://registry.npmjs.org/`.

#### Bun

For `bun`, configure the registry in your `bunfig.toml` file:

```toml
[install]
registry = "https://<your-worker-url>/lock/1440/"
```

Alternatively, you can set the registry for a single command using an environment variable:

```bash
BUN_INSTALL_REGISTRY="https://<your-worker-url>/lock/1440/" bun install
```

## Who benefits

- Developers who want to minimize supply chain attack risks.
- Companies that prioritize predictable and secure dependencies.
- Open-source projects that value trust and ecosystem stability.

**TimeLock NPM Registry** — the same npm registry you know, but with an added layer of protection through delayed releases.
