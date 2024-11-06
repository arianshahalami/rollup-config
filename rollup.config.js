import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import html from '@rollup/plugin-html';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

import pkg from './package.json' assert {type: 'json'};


import {terser} from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy'

const isDev = process.argv.includes('--watch');


const config = {
    input: './main.ts',
    output: {
        dir: 'dist',
        format: 'iife',
        sourcemap: true,
        entryFileNames: 'main.js',
    },
    plugins: [
        resolve(), // Keep this for third-party dependencies
        typescript(), // Handles TypeScript files
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
            presets: ['@babel/preset-env', '@babel/preset-typescript', "@babel/preset-react"]
        }),
        html({
            fileName: 'index.html',     // Output HTML file name in dist folder
            template: ({attributes, files, publicPath, title}) =>
                `
                <!doctype html>
                <html lang="fa" dir="rtl">
                  <head>
                    <meta charset="UTF-8" />
                    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>${pkg.name}</title>
                    ${files.css ? files.css.map(file => `<link rel="stylesheet" href="${publicPath}${file.fileName}">`).join('\n') : ''}
                    ${files.js ? files.js.map(file => `<script type="module" src="${publicPath}${file.fileName}"></script>`).join('\n') : ''}
                  </head>
                  <body>
                    <div id="root"></div>
                  </body>
                </html>
              `
        }),
        isDev && serve({
            open: true,               // Automatically opens the browser
            contentBase: ['dist'],    // Serves files from 'dist' directory
            port: 3000,               // Port to run the server
        }),
        isDev && livereload({
            watch: 'dist',            // Watch 'dist' for changes
        }),


        // terser()
        // copy({
        //   targets: [
        //     { src: './index.html', dest: 'dist' } // Copy index.html to dist
        //   ]
        // })
    ]
};

export default config;