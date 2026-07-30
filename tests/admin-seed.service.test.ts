import test from 'node:test';
import assert from 'node:assert/strict';
import { seedAdmin } from '../server/service/admin-seed.service.ts';

const config = {
  ADMIN_EMAIL: 'admin@example.com',
  ADMIN_PASSWORD: 'secret123',
  ADMIN_NAME: 'Admin',
};

test('skips admin seed when configuration is incomplete', async () => {
  const model = {
    findOne: async () => null,
    create: async () => {
      throw new Error('create should not be called');
    },
  };

  await seedAdmin(model, { ...config, ADMIN_PASSWORD: '' });
});

test('does not modify an existing admin email', async () => {
  let created = false;
  const model = {
    findOne: async () => ({ email: config.ADMIN_EMAIL }),
    create: async () => {
      created = true;
      return {};
    },
  };

  await seedAdmin(model, config);

  assert.equal(created, false);
});

test('creates a missing admin with configured values', async () => {
  let createdInput: Record<string, string> | undefined;
  const model = {
    findOne: async () => null,
    create: async (input: Record<string, string>) => {
      createdInput = input;
      return input;
    },
  };

  await seedAdmin(model, config);

  assert.deepEqual(createdInput, {
    email: config.ADMIN_EMAIL,
    password: config.ADMIN_PASSWORD,
    name: config.ADMIN_NAME,
    role: 'admin',
  });
});
