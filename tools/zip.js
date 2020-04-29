const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process')
const buildDist = require('./dist')

const buildDir = path.resolve(__dirname, '..', 'build');
if (!fs.existsSync(buildDir)) {
	fs.mkdirSync(buildDir, { recursive: true })
}

const buildPath = path.resolve(buildDir, 'build.zip')
if (fs.existsSync(buildPath)) {
	fs.unlinkSync(buildPath)
}

buildDist();

const zip = spawnSync('7z', ['a', '-tzip', path.resolve(buildPath), 
	path.resolve(__dirname, '..', 'dist', 'index.html'),
	path.resolve(__dirname, '..', 'dist', 'index.js'),
	path.resolve(__dirname, '..', 'dist', 'dither-palette.png'),
	path.resolve(__dirname, '..', 'dist', 'shader.frag'),
	path.resolve(__dirname, '..', 'src', 'vendor'),
	path.resolve(__dirname, '..', 'styles')
]);

console.log(zip.stdout.toString())
