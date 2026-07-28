import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function readWorkflow() {
  return readFile(
    new URL('../.github/workflows/deploy.yml', import.meta.url),
    'utf8',
  );
}

test('workflow validates develop and production changes with Node 22', async () => {
  const workflow = await readWorkflow();

  assert.match(workflow, /branches: \[develop, production\]/);
  assert.match(workflow, /node-version: 22/);
  assert.match(workflow, /run: npm ci/);
  assert.match(workflow, /run: npm test/);
  assert.match(workflow, /run: npm run typecheck/);
  assert.match(workflow, /run: npm run build/);
});

test('workflow publishes immutable images to GHCR', async () => {
  const workflow = await readWorkflow();

  assert.match(workflow, /packages: write/);
  assert.match(workflow, /docker\/login-action@v3/);
  assert.match(workflow, /docker\/build-push-action@v6/);
  assert.match(workflow, /type=sha,format=long/);
  assert.match(workflow, /IMAGE_TAG=\$\{GITHUB_REF_NAME\}/);
  assert.match(workflow, /cache-from: type=gha/);
  assert.match(workflow, /cache-to: type=gha,mode=max/);
});

test('workflow deploys staging and production with isolated settings', async () => {
  const workflow = await readWorkflow();

  assert.match(workflow, /TARGET_DIR: \/opt\/ansanweb\/staging/);
  assert.equal([...workflow.matchAll(/HOST_PORT: 3006/g)].length, 2);
  assert.match(workflow, /TARGET_DIR: \/opt\/ansanweb\/production/);
  assert.match(workflow, /ENV_FILE_PROD/);
  assert.match(workflow, /umask 077/);
  assert.match(workflow, /docker compose pull/);
  assert.match(workflow, /docker compose up -d --remove-orphans/);
  assert.match(workflow, /State\.Health\.Status/);
  assert.match(workflow, /docker compose logs --tail=100/);
});
