import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function readProjectFile(path: string) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

test('Dockerfile builds a minimal non-root standalone Next.js image', async () => {
  const dockerfile = await readProjectFile('Dockerfile');

  assert.match(dockerfile, /FROM node:22-alpine AS deps/);
  assert.match(dockerfile, /FROM node:22-alpine AS builder/);
  assert.match(dockerfile, /FROM node:22-alpine AS runner/);
  assert.match(dockerfile, /npm ci/);
  assert.match(dockerfile, /\.next\/standalone/);
  assert.match(dockerfile, /\.next\/static/);
  assert.match(dockerfile, /USER nextjs/);
  assert.match(dockerfile, /PORT=3006/);
  assert.match(dockerfile, /EXPOSE 3006/);
  assert.match(dockerfile, /127\.0\.0\.1:3006\/api\/health/);
  assert.match(dockerfile, /HEALTHCHECK/);
  assert.match(dockerfile, /CMD \["node", "start\.js"\]/);
});

test('Compose publishes the configured port and protects runtime availability', async () => {
  const compose = await readProjectFile('docker-compose.yml');

  assert.match(compose, /image: ghcr.io\/chung2310\/ansanweb:latest/);
  assert.match(compose, /build: \./);
  assert.match(compose, /"3006:3006"/);
  assert.match(compose, /restart: always/);
  assert.match(compose, /PORT: 3006/);
  assert.match(compose, /max-size: "10m"/);
  assert.match(compose, /max-file: "3"/);
});

test('Docker build context excludes local secrets and generated files', async () => {
  const dockerignore = await readProjectFile('.dockerignore');

  assert.match(dockerignore, /^\.env\*$/m);
  assert.match(dockerignore, /^node_modules$/m);
  assert.match(dockerignore, /^\.next$/m);
  assert.match(dockerignore, /^\.git$/m);
});
