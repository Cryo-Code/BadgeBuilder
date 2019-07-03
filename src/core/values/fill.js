import Value from "./value";

import slideBox from "../../vue/utils/slideBox.vue";
import color from "../../vue/utils/color.vue";
import xySlider from "../../vue/utils/xySlider.vue";
import linearGradient from "../../vue/utils/linearGradient.vue";

import toptalPatterns from "../../data/toptal-patterns";

let map = {};

for (let p = toptalPatterns.length - 1; p > 0; p--) {
	if (toptalPatterns[p].name in map) {
		toptalPatterns.splice(p, 1);
	}

	map[toptalPatterns[p].name] = p;
}

export default class Fill extends Value {
	constructor() {
		super();

		this.type = "solid-color";

		this.value = "#FFFFFF";

		this.meta = {
			pattern: {sizing: {x: 250, y: 250}, angle: 0}
		};
	}

	getAttributes(uid) {
		if (this.type == "solid-color")
			return {fill: this.value};
		else if (this.type == "pattern")
			return {fill: "url(#p-fill-" + uid + ")"};
		else if (this.type == "linear-gradient")
			return {fill: "url(#p-fill-" + uid + ")"};

		return {};
	}

	getElements(createElement, uid) {
		if (this.type == "pattern") {
			return [createElement("defs", [
				createElement("pattern", {
					attrs: {
						id: "p-fill-" + uid,
						patternTransform: "rotate(" + this.meta.pattern.angle + ")",
						patternUnits: "userSpaceOnUse",
						width: this.meta.pattern.sizing.x,
						height: this.meta.pattern.sizing.y
					}
				}, [
					createElement("image", {
						attrs: {
							"xlink:href": this.value,
							width: this.meta.pattern.sizing.x,
							height: this.meta.pattern.sizing.y
						}
					})
				])
			])];
		}else if (this.type == "linear-gradient") {
			let stops = this.value.stops
				.slice(0, this.value.stops.length)
				.sort((a, b) => a[1] - b[1])
				.map((stop) => createElement("stop", {
					attrs: {
						offset: (stop[1] * 1) + "",
						style: "stop-color: " + stop[0]
					}
				}));
			
			return [createElement("defs", [
				createElement("linearGradient", {
					attrs: {
						id: "p-fill-" + uid,
						x1: "0",
						y1: "0",
						x2: "1",
						y2: "0",
						gradientUnits: "objectBoundingBox",
						gradientTransform: "rotate(" + this.value.angle + ", 0.5, 0.5)"
					}
				}, stops)
			])];
		}

		return [];
	}

	render() {
		return {
			template: `
				<div>
					<label>Fill</label>

					<slide-box v-model="self" :data="fills">
						<template v-slot:editor="slotProps">
							<div class="slide-block" style="height: auto;">
								<color output="hex" style="margin-top: 10px;" v-model="slotProps.data.value" />
							</div>
						</template>

						<template v-slot:linear-gradient-editor="slotProps">
							<div class="slide-block" style="height: auto;">
								<linear-gradient style="margin-top: 10px;" v-model="slotProps.data.value" />
							</div>
						</template>
					
						<template v-slot:solid-color="slotProps">
							<div class="slide-block color-checker-background"><div :style="'width: 100%; height: 100%; background: ' + slotProps.data.value"></div></div>
						</template>

						<template v-slot:pattern="slotProps">
							<div class="slide-block"><div :style="'width: 100%; height: 100%; background-image: url(' + slotProps.data.value + ')'"></div></div>
						</template>

						<template v-slot:linear-gradient="slotProps">
							<div class="slide-block"><div :style="'width: 100%; height: 100%; background: ' + cssGradient(slotProps.data.value)"></div></div>
						</template>
					</slide-box>
					<div v-if="self.type == 'pattern'">
						<xy-slider v-model="self.meta.pattern.sizing"/>
						<div class="row">
							<div class="col s12">
								<label>Angle</label>
								<input type="range" min="0" max="360" v-model="self.meta.pattern.angle">
							</div>
						</div>
					</div>
				</div>
			`,
			props: ["self"],
			components: { slideBox, color, xySlider, linearGradient },
			methods: {
				cssGradient(grad) {
					let sorted = grad.stops.slice(0, grad.stops.length).sort((a, b) => a[1] - b[1]);

					return `linear-gradient(${grad.angle + 90}deg, ${sorted.map((s) =>
						`${s[0]} ${s[1] * 100}%`
					).join(", ")})`;
				}
			},
			data: () => {
				return {
					fills: {
						"solid-color": {
							default: "#FF0000",
							data: [
								{name: "custom", slot: "editor", custom: true}
							]
						},
						"pattern": {
							default: "https://www.toptal.com/designers/subtlepatterns/patterns/floor-tile.png",
							data: toptalPatterns
						},
						"linear-gradient": {
							default: {
								angle: 0,
								stops: [["#FFFFFF", 0], ["#000000", 1]]
							},
							data: [
								{name: "custom", slot: "linear-gradient-editor", custom: true}
							],
							canOverflow: true
						}
					}
				};
			}
		};
	}

	compare(other) {
		return this.type == other.type && this.value == other.value;
	}
}