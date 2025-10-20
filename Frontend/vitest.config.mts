// vitest.config.mts
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const r = (p: string) => resolve(fileURLToPath(new URL('.', import.meta.url)), p);

export default defineConfig({
    resolve: {
        alias: {
            '@': r('./'),
            '@/*': r('./*'),
        },
    },
    test: {
        environment: 'happy-dom',
        globals: true,
        setupFiles: ['./test/setupTests.ts'],
        css: true,
    },
    esbuild: {
        target: 'node14'
    }
});
