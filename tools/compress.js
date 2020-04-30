const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

// after regenerating pwa files, we should threshold them to make them take up less space.
const pwa = fs.readdirSync(path.resolve(__dirname, '..', 'pwa'))

for (let file of pwa) {
	console.log(file)
	const filePath = path.resolve(path.resolve(__dirname, '..', 'pwa'), file)

	spawnSync('gm', ['convert', filePath, '-dither', '-monochrome', filePath])
}

// I run
// pngquant ./pwa/*.png --ext .png -f
// afterwards to compress images down further.
// too lazy to add it to this script, though...