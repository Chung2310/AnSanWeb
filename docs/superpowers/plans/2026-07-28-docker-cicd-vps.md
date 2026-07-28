# Docker and CI/CD VPS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, validate, publish, and deploy AnSanWeb as a production Next.js Docker container through GitHub Actions.

**Architecture:** A multi-stage Node 22 image consumes Next.js standalone output on internal port 3000. GitHub Actions validates changes, publishes immutable GHCR images, and deploys through environment-specific SSH credentials; both production and staging publish host port 3006 on their respective VPS.

**Tech Stack:** Next.js 15, TypeScript 5, Node.js 22, npm, Docker BuildKit, Docker Compose v2, GitHub Actions, GHCR.

## Global Constraints

- Reverse proxy, DNS, and TLS are outside this repository.
- Production and staging each use host port `3006` on their respective VPS.
- Secrets never enter Docker image layers or Git history.
- Deployments use immutable commit-SHA image tags.
- No commits, pushes, pull requests, or subagents without separate authorization.

---

### Task 1: Application health contract

**Files:** Create `tests/health-route.test.ts`, `src/app/api/health/route.ts`; modify `package.json`, `package-lock.json`.

**Interfaces:** Produces `GET(): Promise<Response>` with HTTP 200 and `{ status: "ok", service: "ansanweb" }`.

- [ ] Install `tsx` as a dev dependency and add `"test": "node --import tsx --test tests/**/*.test.ts"`.
- [ ] Write a failing `node:test` test importing `GET`, asserting status 200 and the exact JSON contract.
- [ ] Run `npm test`; expect failure because the route does not exist.
- [ ] Implement `GET` with `Response.json({ status: 'ok', service: 'ansanweb' })`.
- [ ] Run `npm test`; expect one pass and zero failures.

### Task 2: Production Docker artifact

**Files:** Create `tests/deployment-config.test.ts`, `.dockerignore`, `Dockerfile`, `docker-compose.yml`.

**Interfaces:** Consumes standalone Next.js output and `/api/health`; produces an unprivileged image on port 3000 and Compose variables `IMAGE_NAME`, `IMAGE_TAG`, `CONTAINER_NAME`, `HOST_PORT`.

- [ ] Write failing static contract tests for a multi-stage Node 22 Alpine image, standalone/static/public copies, `nextjs` user, healthcheck, parameterized Compose port/image, restart policy, and bounded logs.
- [ ] Run `npm test`; expect missing deployment-file failures.
- [ ] Implement cached multi-stage Dockerfile, secret-safe `.dockerignore`, and Compose defaulting host port to 3006.
- [ ] Run `npm test`; expect all tests to pass.
- [ ] Run `docker compose config`; expect port 3006 mapped to container port 3000.

### Task 3: GitHub Actions CI/CD

**Files:** Create `.github/workflows/deploy.yml`; modify `tests/deployment-config.test.ts`.

**Interfaces:** Consumes GHCR token plus separate staging/production SSH and env-file secrets; produces CI checks, SHA-tagged images, staging deploys from `develop`, production deploys from `production`.

- [ ] Extend the static test for branch triggers, Node 22/npm CI, tests/typecheck/build, package permissions, SHA tags, port 3006 for both environments, secret-safe `.env` creation, pull-before-up, and health waiting.
- [ ] Run `npm test`; expect failure because the workflow is absent.
- [ ] Implement checkout/setup-node/Buildx/login/metadata/build-push plus ERP-compatible Appleboy SCP/SSH deployment steps.
- [ ] Run `npm test`; expect all tests to pass.

### Task 4: Documentation and full verification

**Files:** Modify `README.md`.

**Interfaces:** Produces exact setup, secrets, local test, deployment, healthcheck, troubleshooting, and SHA rollback instructions.

- [ ] Document local commands, environment mapping, secrets, GHCR access, VPS prerequisites, Nginx upstream ports, troubleshooting, and rollback.
- [ ] Run `npm test`, `npm run typecheck`, and `npm run build`; expect exit 0.
- [ ] Run `docker compose config`, build `ansanweb:verify`, start a temporary container, poll `/api/health`, request `/`, and verify the runtime user is non-root.
- [ ] Review the design and run `git diff --check`, `git diff`, and `git status --short`; report any environment-limited verification honestly.
