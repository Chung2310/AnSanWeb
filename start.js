const { spawn } = require('child_process');

console.log('🔄 Starting AnSanWeb unified server...');

const PORT = process.env.PORT || '3006';

console.log(`🚀 Spawning Combined Express & Next.js Server on port ${PORT}...`);
const server = spawn('npx', ['tsx', 'server/server.ts'], {
  stdio: 'inherit',
  env: { ...process.env, PORT }
});

// Monitor processes
server.on('exit', (code) => {
  console.log(`❌ Server process exited with code ${code}`);
  process.exit(code || 1);
});

// Graceful shutdown
const shutdown = () => {
  console.log('🧹 Shutting down container services...');
  server.kill('SIGTERM');
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
