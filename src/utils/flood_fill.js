
export const flood_fill = (renderer, renderTexture, start_x, start_y, fill_r, fill_g, fill_b, fill_a) => {
	
	start_x = Math.floor(start_x);
	start_y = Math.floor(start_y);

	// algorithm taken from jspaint
	const stack = [[start_x, start_y]];
	const c_width = renderTexture.width;
	const c_height = renderTexture.height;
	
	const id = renderer.extract.pixels(renderTexture);

	let pixel_pos = (start_y*c_width + start_x) * 4;
	const start_r = id[pixel_pos+0];
	const start_g = id[pixel_pos+1];
	const start_b = id[pixel_pos+2];
	const start_a = id[pixel_pos+3];
	
	if(
		fill_r === start_r &&
		fill_g === start_g &&
		fill_b === start_b &&
		fill_a === start_a
	){
		return;
	}
	
	while(stack.length){
		let new_pos;
		let x;
		let y;
		let reach_left;
		let reach_right;
		new_pos = stack.pop();
		x = new_pos[0];
		y = new_pos[1];

		pixel_pos = (y*c_width + x) * 4;
		while(should_fill_at(pixel_pos)){
			y--;
			pixel_pos = (y*c_width + x) * 4;
		}
		reach_left = false;
		reach_right = false;
		// eslint-disable-next-line no-constant-condition
		while(true){
			y++;
			pixel_pos = (y*c_width + x) * 4;
			
			if(!(y < c_height && should_fill_at(pixel_pos))){
				break;
			}
			
			do_fill_at(pixel_pos);

			if(x > 0){
				if(should_fill_at(pixel_pos - 4)){
					if(!reach_left){
						stack.push([x - 1, y]);
						reach_left = true;
					}
				}else if(reach_left){
					reach_left = false;
				}
			}

			if(x < c_width-1){
				if(should_fill_at(pixel_pos + 4)){
					if(!reach_right){
						stack.push([x + 1, y]);
						reach_right = true;
					}
				}else if(reach_right){
					reach_right = false;
				}
			}

			pixel_pos += c_width * 4;
		}
	}

	// rerender the texture with the new pixels
	const newTexture = PIXI.Texture.fromBuffer(id, c_width, c_height);
	const newTextureSprite = new PIXI.Sprite(newTexture);
	renderer.render(newTextureSprite, renderTexture, true, null, false);

	function should_fill_at(pixel_pos){
		return (
			// matches start color (i.e. region to fill)
			id[pixel_pos+0] === start_r &&
			id[pixel_pos+1] === start_g &&
			id[pixel_pos+2] === start_b &&
			id[pixel_pos+3] === start_a
		);
	}

	function do_fill_at(pixel_pos){
		id[pixel_pos+0] = fill_r;
		id[pixel_pos+1] = fill_g;
		id[pixel_pos+2] = fill_b;
		id[pixel_pos+3] = fill_a;
	}
}
