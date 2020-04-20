precision mediump float;

varying vec2 vTextureCoord;//The coordinates of the current pixel
uniform sampler2D uSampler;//The image data

uniform sampler2D palette;
uniform float swatchSize;


// Currently, this is a dummy shader that just removes red.
// We want to eventually sample a palette, and then use that 
// to produce our dither patterns.
void main(void) {
	float value = texture2D(uSampler, vTextureCoord).r;
	
	// TODO: replace these with uniforms
	float appWidth = 800.0;
	float appHeight = 600.0;

	// TODO: replace these with uniforms
	float paletteWidth = 128.0;
	float paletteHeight = 8.0;

	float pixelX = vTextureCoord.x * appWidth;
	float pixelY = vTextureCoord.y * appHeight;

	float positionXinSwatch = floor(mod(pixelX, swatchSize));
	float positionYinSwatch = floor(mod(pixelY, swatchSize));

	// we map the greyscale r value to the correct swatch by first converting the 
	// scale from [0.0, 0.1] to [0, 256] and dividing that out by the number of colors / swatches we have.
	// basically a palette remapping, but we really don't care about the in-betweens.
	float swatchToUse = value * 256.0 / 16.0;

	// note that this assumes that all of the swatches are in one horizontal strip.
	float positionXTotal = positionXinSwatch + swatchSize * floor(swatchToUse);

	vec2 startTextureCoord = vec2(positionXTotal / paletteWidth, positionYinSwatch/paletteHeight);
	vec4 sampledPalette = texture2D(palette, startTextureCoord);

	// hard threshold the pixels into black and white. May not be necessary.
	if (sampledPalette.r > 0.5) {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	} else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
}