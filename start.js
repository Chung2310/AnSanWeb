const { spawn } = require('child_process');

console.log('🔄 Starting AnSanWeb unified container services...');

// 1. Spawn Express Backend
console.log('🚀 Spawning Express Backend on port 3001...');
const backend = spawn('npx', ['tsx', 'server/server.ts'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '3001', BACKEND_PORT: '3001' }
});

// 2. Spawn Next.js Frontend
console.log('🚀 Spawning Next.js Frontend on port 3006...');
const frontend = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '3006' }
});

// Monitor processes
backend.on('exit', (code) => {
  console.log(`❌ Backend process exited with code ${code}`);
  process.exit(code || 1);
});

frontend.on('exit', (code) => {
  console.log(`❌ Frontend process exited with code ${code}`);
  process.exit(code || 1);
});

// Graceful shutdown
const shutdown = () => {
  console.log('🧹 Shutting down container services...');
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
