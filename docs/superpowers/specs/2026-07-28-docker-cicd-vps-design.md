# Docker and CI/CD Deployment Design

## Objective

Package AnSanWeb as a production Docker image and deploy it from GitHub Actions to a Docker-enabled VPS. The deployment must support separate staging and production environments and leave reverse-proxy configuration to the operator.

## Deployment Model

- Pull requests targeting `develop` or `production` run quality and build checks only.
- Pushes to `develop` publish and deploy the staging image.
- Pushes to `production` publish and deploy the production image.
- GitHub Container Registry (GHCR) stores images tagged by branch and commit SHA.
- GitHub Actions connects to the VPS over SSH, copies the Compose configuration, writes the environment file from GitHub Secrets, pulls the selected image, and recreates the container.
- Staging lives in `/opt/ansanweb/staging` and publishes host port `3006`.
- Production lives in `/opt/ansanweb/production` and publishes host port `3006`.
- Nginx configuration and TLS termination remain outside this repository.

## Container Architecture

The Dockerfile uses Node.js 22 Alpine and three focused stages:

1. A dependency stage installs the exact dependency graph with `npm ci`.
2. A build stage runs the Next.js production build with `output: standalone`.
3. A minimal runtime stage copies only `.next/standalone`, `.next/static`, and `public`.

The runtime container:

- runs with `NODE_ENV=production`, `HOSTNAME=0.0.0.0`, and port `3006`;
- runs as the unprivileged `nextjs` user;
- exposes port `3006`;
- includes a healthcheck against `/api/health` using Node's built-in HTTP APIs;
- receives secrets only at runtime through an environment file and never copies `.env` into the image.

The Compose service is parameterized through `IMAGE_NAME`, `IMAGE_TAG`, `HOST_PORT`, and `CONTAINER_NAME`. It uses an always-restart policy and bounded JSON-file logs. It does not depend on the ERP external Docker network because Nginx will proxy to explicitly published host ports.

## Application Health Contract

`GET /api/health` returns HTTP 200 and a small JSON response identifying the service as healthy. The endpoint performs no external Firebase or Google AI request, so it verifies that the Next.js server has started and can serve traffic without making deployments sensitive to temporary third-party outages.

Docker Compose waits for this endpoint through its healthcheck. After `docker compose up`, the deployment script waits for the container state to become healthy. A timeout or unhealthy state fails the GitHub Actions job and prints recent container logs for diagnosis.

## CI Pipeline

The CI job runs on Ubuntu with Node.js 22 and npm cache enabled:

1. Check out the exact commit.
2. Install dependencies with `npm ci`.
3. Run `npm run typecheck`.
4. Build the production application on pull requests.

The repository currently defines `next lint`, which is not supported by Next.js 15 in this form, and contains no ESLint dependency/configuration. Linting is therefore not claimed as a CI gate in this scope. Type checking remains explicit because `next.config.js` currently permits Next.js builds to ignore TypeScript errors.

For pushes, the image job runs only after CI succeeds. Docker Buildx builds the multi-stage image, uses GitHub Actions cache, logs into GHCR with `GITHUB_TOKEN`, and publishes both the branch tag and immutable SHA tag.

## CD Pipeline

Deployment runs only for push events after the image job succeeds:

- `develop` uses staging secrets, `/opt/ansanweb/staging`, port `3006`, and the immutable image tag for that commit.
- `production` uses production secrets, `/opt/ansanweb/production`, port `3006`, and the immutable image tag for that commit.

The workflow copies `docker-compose.yml` to the target directory, creates `.env` from the environment-specific secret, authenticates Docker to GHCR, pulls the immutable image, recreates the service, waits for health, and prunes only dangling images. Concurrent deploys for the same branch are serialized so an older run cannot overtake a newer deployment.

## Required GitHub Secrets

Staging:

- `SSH_HOST`
- `SSH_USER`
- `SSH_KEY`
- `SSH_PORT` (optional; defaults to `22`)
- `ENV_FILE`

Production:

- `SSH_HOST_PROD`
- `SSH_USER_PROD`
- `SSH_KEY_PROD`
- `SSH_PORT_PROD` (optional; defaults to `22`)
- `ENV_FILE_PROD`

The Firebase browser configuration currently lives in source code and does not need to be duplicated in these environment files. Runtime-only keys such as `GOOGLE_GENAI_API_KEY`, if the Genkit flows are exposed in production, belong in the appropriate `ENV_FILE` secret.

## VPS Preconditions

- Docker Engine and Docker Compose v2 are installed.
- The SSH user can run Docker commands.
- Host port `3006` is available on each environment VPS; staging and production cannot bind it simultaneously on one VPS.
- `/opt/ansanweb` can be created by the SSH user.
- The VPS can reach `ghcr.io`.
- The GHCR package is public, or the workflow-provided registry login has pull access.

## Verification Strategy

Automated and local verification covers:

- a route-level test for the health response before implementing the route;
- TypeScript checking;
- a Next.js production build;
- Docker Compose configuration rendering;
- Docker image build;
- starting the image locally and waiting for a healthy status;
- HTTP checks for `/api/health` and `/`;
- inspection of the runtime user and image contents where practical.

GitHub Actions syntax and branch conditions are reviewed statically, while the same Docker build and runtime smoke tests exercise the artifact that GHCR and the VPS will use. A real SSH deployment still requires the configured GitHub Secrets and reachable VPS.

## Failure Handling

- Dependency, type, build, or image failures stop before deployment.
- SSH, registry login, pull, or Compose failures fail the deployment job.
- An unhealthy container fails the deployment and emits `docker compose ps` plus recent logs.
- Containers restart automatically after process or VPS restarts.
- Immutable SHA tags make a previous version selectable for manual rollback without rebuilding.
- Secrets are excluded through `.dockerignore`, are not baked into image layers, and are written only on the VPS.

## Scope Boundaries

This change does not configure Nginx, DNS, TLS certificates, Firebase rules deployment, database migrations, automated rollback, monitoring, or alerting. Those can be added separately after the base container deployment is proven.
