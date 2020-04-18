
precision mediump float;

varying vec2 vTextureCoord;//The coordinates of the current pixel
uniform sampler2D uSampler;//The image data

// Currently, this is a dummy shader that just removes red.
// We want to eventually sample a palette, and then use that 
// to produce our dither patterns.
void main(void) {
	float value = texture2D(uSampler, vTextureCoord).r;
	gl_FragColor = texture2D(uSampler, vTextureCoord);

	if (value > 0.5) {
   		gl_FragColor.r = 0.0;
	} else {
   		gl_FragColor.b = 0.0;
	}
   	
}