/**
 * @fileoverview configuration of esbuild
 */

const esbuild = require('esbuild');

async function build() {
    const ts = performance.now();
    await esbuild.build({
        entryPoints: ['./src/app.ts'],
        bundle: true,
        platform: 'node',
        outfile: './dist/app.js',
        format: 'cjs',
        external: ['node:events'],
        loader: { '.ts': 'ts' }
    });
    const te = performance.now();
    const dt = te - ts;
    console.log(`build completed in ${dt}ms`);
}

build();