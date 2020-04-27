// run in node
const fs = require('fs')
const path = require('path')

const vendorPackages = {
	'pixi.js': 'pixi.js/dist/pixi.min.js',
	'pixi-viewport.js': 'pixi-viewport/dist/viewport.js',
	'preact.js': 'htm/preact/standalone.mjs',
	'rgbquant.js': 'rgbquant/src/rgbquant.js'
}

// clear vendor folder
const vendorFolder = path.resolve(__dirname, '..', 'src', 'vendor')
if (fs.existsSync(vendorFolder)) {
	fs.unlinkSync(vendorFolder);
}
fs.mkdirSync(vendorFolder, { recursive: true })

for (let package in vendorPackages) {
	const packagePath = path.resolve(__dirname, '..', 'node_modules', vendorPackages[package]);
	fs.copyFileSync(packagePath, path.resolve(vendorFolder, package));
}

