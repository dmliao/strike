const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')

const buildDist = () => {

	const localWarn = `If you only want to run the app locally, you can instead point an http server at the project root directory.
The build step isn't required to run the program; it's mostly to minify the JS and package up the files nicely for browsers that don't support modules.`

	const indexPath = path.resolve(__dirname, '..', 'dist', 'index.html')
	if (fs.existsSync(indexPath)) {
		fs.unlinkSync(indexPath)
	}

	try {
		const parcel = execSync('parcel build ' + path.resolve('__dirname', '..', 'src', 'index.js'));
		console.log(parcel.toString())
	} catch (e) {
		console.warn(`This build process requires you to have parcel globally installed and on the path.

If you want to create a minified build, please install parcel using yarn or npm.

${localWarn}
`)

		process.exit(1);
	}
		
	const indexFile = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf-8');
	let distFile = indexFile.replace(/\/src/g, '')
	distFile = distFile.replace('type="module" ', '');

	console.log('Rewrote HTML file successfully')

	fs.writeFileSync(path.resolve(__dirname, '..', 'dist', 'index.html'), distFile)

	// add assets
	fs.copyFileSync(path.resolve(__dirname, '..', 'src', 'shaders', 'shader.frag'), path.resolve(__dirname, '..', 'dist', 'shader.frag'))
	fs.copyFileSync(path.resolve(__dirname, '..', 'src', 'palette', 'dither-palette.png'), path.resolve(__dirname, '..', 'dist', 'dither-palette.png'))

	const rawJS = fs.readFileSync(path.resolve('__dirname', '..', 'dist', 'index.js'), 'utf-8');
	let distJS = rawJS.replace(/src\/shaders\/shader\.frag/g, 'shader.frag');
	distJS = distJS.replace(/src\/palette\/dither-palette\.png/g, 'dither-palette.png');

	fs.writeFileSync(path.resolve('__dirname', '..', 'dist', 'index.js'), distJS)

	// copy other files over
	const copyVendor = execSync('cp -r ' + path.resolve(__dirname, '..', 'src', 'vendor') + ' ' + path.resolve(__dirname, '..', 'dist', 'vendor'));
	const copyStyles = execSync('cp -r ' + path.resolve(__dirname, '..', 'styles') + ' ' + path.resolve(__dirname, '..', 'dist', 'styles'));

}

module.exports = buildDist;