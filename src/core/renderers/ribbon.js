import Renderer from "../renderer";
import Chroma from "chroma-js";

import * as Values from "../values";

export default class Ribbon extends Renderer {
	render(createElement, isMask) {
		let w = this.layer.data.size.value.width;
		let h = this.layer.data.size.value.height;
		let x = this.layer.data.position.value.x;
		let y = this.layer.data.position.value.y;
		
		let children = [
			
		];

		let shift = this.layer.data.shift.value.value;
		let c = this.layer.data.curve.value.value;
		let cShift = this.layer.data.capShift.value.value;
		let cSize = this.layer.data.capSize.value.value;

		let topLeft = {
			x: x - w / 2,
			y: y - h / 2 + shift
		};

		let topRight = {
			x: x + w / 2,
			y: y - h / 2 - shift
		};

		let bottomLeft = {
			x: x - w / 2,
			y: y + h / 2 + shift
		};

		let bottomRight = {
			x: x + w / 2,
			y: y + h / 2 - shift
		};

		let attrs = this.layer.data.fill.active ? this.layer.data.fill.value.getAttributes(this.layer.id) : {};

		if (!isMask)
			attrs = Object.assign(attrs, this.mask(createElement, children));

		/*
children.push(createElement("path", {
			attrs: Object.assign({}, attrs, {
				d: `M ${topLeft.x} ${topLeft.y}
					C ${topLeft.x + w / 2} ${cShift.x + c + (topLeft.y + topRight.y) / 2} ${topRight.x - w / 2} ${-c + (topRight.y + topLeft.y) / 2} ${topRight.x} ${topRight.y}
					L ${bottomLeft.x + cSize} ${cShift.x + bottomLeft.y}
					C ${bottomLeft.x - w / 2} ${-c + (bottomLeft.y + bottomRight.y) / 2} ${bottomLeft.x + w / 2} ${c + (bottomLeft.y + bottomRight.y) / 2} ${bottomLeft.x} ${bottomLeft.y}`
			})
		}));

		children.push(createElement("path", {
			attrs: Object.assign({}, attrs, {
				d: `M ${topLeft.x} ${topLeft.y}
					C ${topLeft.x} ${topLeft.y} ${topLeft.x - 25} ${topLeft.y} ${topLeft.x - 25} ${topLeft.y}
					L ${bottomLeft.x - 25} ${bottomLeft.y}
					C ${bottomLeft.x - 25} ${bottomLeft.y} ${bottomLeft.x} ${bottomLeft.y} ${bottomLeft.x} ${bottomLeft.y}`
					`M ${topLeft.x} ${topLeft.y}
					L ${topLeft.x - 25} ${topLeft.y}
					L ${bottomLeft.x - 25} ${bottomLeft.y}
					L ${bottomLeft.x} ${bottomLeft.y}`
			})
		}));
		*/

		let lt = topLeft;
		let ltl = {
			x: topLeft.x + 25,
			y: topLeft.y + cShift.x - cSize
		};

		let lb = bottomLeft;
		let lbl = {
			x: bottomLeft.x + 25,
			y: bottomLeft.y + cShift.x + cSize
		};

		let behindAttrs = Object.assign({}, attrs);

		if (this.layer.data.fill.value.type == "solid-color") {
			behindAttrs.fill = Chroma(this.layer.data.fill.value.value).darken().hex();
		}

		children.push(createElement("path", {
			attrs: Object.assign({}, behindAttrs, {
				d: /*`M ${topLeft.x} ${topLeft.y}
					C ${topLeft.x + w / 2} ${cShift.x + c + (topLeft.y + topRight.y) / 2} ${topRight.x - w / 2} ${-c + (topRight.y + topLeft.y) / 2} ${topRight.x} ${topRight.y}
					L ${bottomLeft.x + cSize} ${cShift.x + bottomLeft.y}
					C ${bottomLeft.x - w / 2} ${-c + (bottomLeft.y + bottomRight.y) / 2} ${bottomLeft.x + w / 2} ${c + (bottomLeft.y + bottomRight.y) / 2} ${bottomLeft.x} ${bottomLeft.y}`*/
					`M ${lt.x} ${lt.y}
					C ${lt.x} ${lt.y} ${ltl.x} ${ltl.y} ${ltl.x} ${ltl.y}
					L ${lbl.x} ${lbl.y}
					C ${lbl.x} ${lbl.y} ${lb.x} ${lb.y} ${lb.x} ${lb.y}`
					
			})
		}));

		children.push(createElement("path", {
			attrs: Object.assign({}, attrs, {
				d: `M ${topLeft.x} ${topLeft.y}
					C ${topLeft.x + w / 2} ${c + (topLeft.y + topRight.y) / 2} ${topRight.x - w / 2} ${-c + (topRight.y + topLeft.y) / 2} ${topRight.x} ${topRight.y}
					L ${bottomRight.x} ${bottomRight.y}
					C ${bottomRight.x - w / 2} ${-c + (bottomLeft.y + bottomRight.y) / 2} ${bottomLeft.x + w / 2} ${c + (bottomLeft.y + bottomRight.y) / 2} ${bottomLeft.x} ${bottomLeft.y}`
			})
		}));

		let fillElems = this.layer.data.fill.value.getElements(createElement, this.layer.id);

		if (isMask) {
			return children[children.length - 1];
		}

		return createElement("g", fillElems.concat(children));
	}

	defaults() {
		return {
			position: {required: true, value: new Values.Position(256, 256)},
			size: {required: true, value: new Values.Size(100, 100)},
			cap: {required: true, value: new Values.Select("Cap", "Snake", ["Snake", "Rectangle", "Triangle", "Round", "Knife"])},
			capSize: {required: true, value: new Values.Slider("Cap Size", 0, -256, 256, 0.5)},
			capSpread: {required: true, value: new Values.Slider("Cap Spread", 0, -256, 256, 0.5)},
			capDirection: {required: true, value: new Values.Slider("Cap Direction", 0, -256, 256, 0.5)},
			shift: {required: true, value: new Values.Slider("Side Shift", 0, -256, 256, 0.5)},
			curve: {required: true, value: new Values.Slider("Curve", 0, -256, 256, 0.5)},

			capShift: {required: true, value: new Values.DualSlider("Cap Shift Left", "Cap Shift Right", 12, 12, -256, 256)},

			fill: new Values.Fill()
		};
	}
}