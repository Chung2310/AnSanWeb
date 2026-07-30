# Admin Account Seed Design

## Goal

Create the first admin account automatically from environment variables when the server starts, without overwriting an existing account.

## Configuration

The server reads:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

These variables are documented in `.env.example`. If any variable is missing, the seed is skipped with a warning. Password values are never logged.

## Runtime behavior

After MongoDB connects and before the HTTP server starts, a dedicated admin-seed service checks for a user matching `ADMIN_EMAIL`.

- If the user exists, no fields are changed.
- If the user does not exist, a user is created with the configured name, password, email, and `admin` role.
- The existing Mongoose password hook hashes the new password.
- Seed failures are logged and prevent startup, because the configured bootstrap state could not be established safely.

## Testing

The seed behavior is covered by tests for:

1. Missing configuration skips without creating a user.
2. An existing email is left unchanged.
3. A missing email creates one admin user with the configured values.

The implementation remains idempotent across repeated server starts.
