# Admin Seed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create an idempotent admin account at server startup from `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME`.

**Architecture:** Add a focused `admin-seed.service.ts` that uses `UserModel` directly and relies on the existing Mongoose password hash hook. Call it after `connectDB()` and before Next.js preparation. Missing configuration skips with a warning; database/creation failures stop startup through the existing startup error path.

**Tech Stack:** Node.js, TypeScript, Express startup, Mongoose, bcryptjs hook, Node test runner.

## Global Constraints

- Never overwrite an existing user matched by `ADMIN_EMAIL`.
- Never log `ADMIN_PASSWORD`.
- Preserve the existing `admin` role model default explicitly when creating the seed user.
- Keep unrelated working-tree changes untouched.

### Task 1: Add tested admin seed service

**Files:**
- Create: `server/service/admin-seed.service.ts`
- Create: `tests/admin-seed.service.test.ts`

**Interfaces:**
- Produce `seedAdmin(): Promise<void>`.
- Read `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` from `process.env`.

- [ ] Write tests for missing configuration, existing email preservation, and new admin creation using a small injected model seam or isolated service contract.
- [ ] Run the focused test and confirm it fails before the service exists.
- [ ] Implement the minimal idempotent seed behavior, with no password logging.
- [ ] Run the focused test and confirm it passes.

### Task 2: Wire configuration and startup

**Files:**
- Modify: `.env.example`
- Modify: `server/server.ts`

- [ ] Document the three admin seed variables with safe placeholder values.
- [ ] Call `await seedAdmin()` immediately after `await connectDB()`.
- [ ] Preserve the existing startup failure behavior for seed errors.
- [ ] Run the build and verify startup wiring compiles.

### Task 3: Verify behavior

**Files:**
- No additional files.

- [ ] Run the full test command if available.
- [ ] Run `npm run build`.
- [ ] Inspect the diff for accidental changes and confirm no secret values are committed.
- [ ] Commit the implementation as `feat: seed admin account from environment`.
