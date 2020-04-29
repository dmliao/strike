const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

const buildPath = path.resolve(__dirname, '..', 'build')
if (!fs.existsSync(buildPath)) {
	fs.mkdirSync(buildPath, { recursive: true })
}

const zip = spawn('7z', ['a', '-tzip', path.resolve(buildPath, 'build.zip'), 
	path.resolve(__dirname, '..', 'index.html'),
	path.resolve(__dirname, '..', 'src'),
	path.resolve(__dirname, '..', 'styles')
]);

zip.stdout.pipe(process.stdout)