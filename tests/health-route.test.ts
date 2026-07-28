import assert from 'node:assert/strict';
import test from 'node:test';

import { GET } from '../src/app/api/health/route';

test('GET /api/health reports that AnSanWeb is healthy', async () => {
  const response = await GET();

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: 'ok',
    service: 'ansanweb',
  });
});
