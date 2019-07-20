import Renderer from "../renderer";

import * as Values from "../values";

export default class Texture extends Renderer {
	render(createElement, isMask) {
		let w = this.layer.data.size.value.width;
		let h = this.layer.data.size.value.height;
		let x = this.layer.data.position.value.x - w / 2;
		let y = this.layer.data.position.value.y - h / 2;
		
		let children = [
			
		];

		let attrs = {};

		if (!isMask)
			attrs = this.mask(createElement, children);

		children.push(createElement("image", {
			attrs: Object.assign(attrs, {
				x: x,
				y: y,
				widget: w,
				height: h,
				"xlink:href": this.layer.data.image.value.value
			})
		}));

		if (isMask) {
			return children[children.length - 1];
		}

		if (!this.layer.data.image.active)
			children = [];

		return createElement("g", children);
	}

	defaults() {
		return {
			position: {required: true, value: new Values.Position(256, 256)},
			size: {required: true, value: new Values.Size(100, 100)},
			image: new Values.Image()
		};
	}
}