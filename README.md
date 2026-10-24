# BDD with Cucumber + TypeScript

Behaviour-driven practice: Gherkin features first, step definitions second, domain code last.
Two small domains, a shopping cart and a library lending desk, each driven entirely by its `.feature` file.

```
features/
  cart.feature
  library.feature
  step_definitions/   glue between Gherkin and the domain
  support/world.ts    per-scenario state
src/                  plain TypeScript domain, no framework
```

```bash
npm install
npm test
```
