import Renderer from "../renderer";

import * as Values from "../values";

export default class Text extends Renderer {
	render(createElement) {
		let w = 100;//this.layer.data.arc.value.value;
		let h = this.layer.data.arc.value.value * 10;

		let shift = h * (1 + (4*(Math.sqrt(2)-1)/3));

		let x = this.layer.data.position.value.x;
		let y = this.layer.data.position.value.y;
		
		let fillAttr = this.layer.data.fill.value.getAttributes(this.layer.id);
		let fillElems = this.layer.data.fill.value.getElements(createElement, this.layer.id);

		return createElement("g", fillElems.concat([
			createElement("defs", [
				createElement("path", {
					attrs: {
						id: this.layer.id + "-text-path",
						d: `M ${x - w / 2} ${y + shift} C ${x - w / 2} ${y - h / 2} ${x + w / 2} ${y - h / 2} ${x + w / 2} ${y + shift}`
					}
				}),
				createElement("style", {
					attrs: {type: "text/css"}
				}, [
					'@import url(https://fonts.googleapis.com/css?family=' + this.layer.data.font.value.value.replace(' ', '+') + ':' + this.layer.data.font.value.weight + ')'
				])
			]),
			createElement("text", {
				attrs: Object.assign(fillAttr, {
					width: w,
					style: `font-family: "${this.layer.data.font.value.value}"; font-weight: ${this.layer.data.font.value.weight.replace("i", "")}; font-style: ${this.layer.data.font.value.weight.includes("i") ? "italic" : "normal"}`
				})
			}, [
				createElement("textPath", {
					attrs: {
						"xlink:href": "#" + this.layer.id + "-text-path",
						"text-anchor": "middle",
						"startOffset": "50%",
						"dominant-baseline": this.layer.data.baseline.value.value
					}
				}, [this.layer.data.text.value.text])
			]
		)]));
	}

	defaults() {
		return {
			position: {required: true, value: new Values.Position(256, 256)},
			arc: {required: true, value: new Values.Slider("Arc", 0, -100, 100, 0.1)},
			text: {required: true, value: new Values.Text("Text")},
			font: {required: true, value: new Values.Font()},
			baseline: {required: true, value: new Values.Select("Baseline", "middle", ["middle", "baseline", "hanging"])},
			fill: new Values.Fill()
		};
	}
}