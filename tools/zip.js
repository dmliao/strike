const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process')

const buildDir = path.resolve(__dirname, '..', 'build');
if (!fs.existsSync(buildDir)) {
	fs.mkdirSync(buildDir, { recursive: true })
}

const buildPath = path.resolve(buildDir, 'build-raw.zip')
if (fs.existsSync(buildPath)) {
	fs.unlinkSync(buildPath)
}

const zip = spawnSync('7z', ['a', '-tzip', path.resolve(buildPath), 
	path.resolve(__dirname, '..', 'index.html'),
	path.resolve(__dirname, '..', 'src'),
	path.resolve(__dirname, '..', 'pwa'),
	path.resolve(__dirname, '..', 'styles')
]);

console.log(zip.stdout.toString())
