import Renderer from "../renderer";

import * as Values from "../values";

export default class Square extends Renderer {
	render(createElement) {
		let w = this.layer.data.size.value.width;
		let h = this.layer.data.size.value.height;
		let x = this.layer.data.position.value.x - w / 2;
		let y = this.layer.data.position.value.y - h / 2;
		
		let fillAttr = this.layer.data.fill.value.getAttributes(this.layer.id);
		let fillElems = this.layer.data.fill.value.getElements(createElement, this.layer.id);

		return createElement("g", fillElems.concat([
			createElement("rect", {
				attrs: Object.assign(fillAttr, {
					x: x,
					y: y,
					width: w,
					height: h
				})
			}
		)]));
	}

	defaults() {
		return {
			position: {required: true, value: new Values.Position(256, 256)},
			size: {required: true, value: new Values.Size(100, 100)},
			fill: new Values.Fill()
		};
	}
}