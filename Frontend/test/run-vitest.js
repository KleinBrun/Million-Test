try {
    require('./polyfill.js');
} catch (err) {
    console.warn('[run-vitest] polyfill error:', err);
}

const { spawn } = require('child_process');
const path = require('path');

const isWin = process.platform === 'win32';
const vitestBin = path.join(process.cwd(), 'node_modules', '.bin', `vitest${isWin ? '.cmd' : ''}`);

const args = process.argv.slice(2);

const cp = spawn(vitestBin, args.length ? args : [], { stdio: 'inherit' });

cp.on('exit', (code) => {
    process.exit(code);
});
