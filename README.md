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

## Who benefits

- Developers who want to minimize supply chain attack risks.
- Companies that prioritize predictable and secure dependencies.
- Open-source projects that value trust and ecosystem stability.

**TimeLock NPM Registry** — the same npm registry you know, but with an added layer of protection through delayed releases.
