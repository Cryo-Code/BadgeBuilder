import Value from "./value";

import slideBox from "../../vue/utils/slideBox.vue";
import color from "../../vue/utils/color.vue";
import xySlider from "../../vue/utils/xySlider.vue";
import linearGradient from "../../vue/utils/linearGradient.vue";

import fonts from "../../data/google-fonts";

let data = [];

for (let font of fonts) {
	data.push({name: font.name, value: font.name, slot: "font"});
}

let getFont = (name) => {
	for (let f of fonts)
		if (f.name == name)
			return f;
};

export default class Font extends Value {
	constructor() {
		super();

		this.value = "Roboto";
		this.type = "google-fonts";
		this.weight = "400";

		this.meta = {
			
		};
	}

	render() {
		return {
			template: `
				<div class="row">
					<label style="margin-left: 11.25px">Font</label>
					<slide-box v-model="self" :data="fonts">
						<template v-slot:google-fonts="slotProps">
							<div class="slide-block" style="height: auto;">
								<p :style="'margin: 0; color: white; font-size: 26px; font-family: \\'' + slotProps.data.value + '\\''">{{slotProps.data.value}}</p>
								<link :href="'https://fonts.googleapis.com/css?family=' + slotProps.data.value.replace(' ', '+')" rel="stylesheet" />
							</div>
						</template>
					</slide-box>
					<div>
						<div class="row">
							<div class="col s12">
								<label>Style</label>
								<select ref="select" v-model="self.weight">
									<option v-for="variant in variants" :value="variant.name">{{variant.a}} {{weightAsText(variant.name)}}</option>

									<!--<option value="100">100 Thin</option>
										<option value="100i">100 Thin Italic</option>
										<option value="300">300 Light</option>
										<option value="300i">300 Light Italic</option>
										<option value="400">400 Regular</option>
										<option value="400i">400 Regular Italic</option>
										<option value="500">500 Medium</option>
										<option value="500i">500 Medium Italic</option>
										<option value="700">700 Bold</option>
										<option value="700i">700 Bold Italic</option>
										<option value="900">900 Black</option>
										<option value="900i">900 Black Italic</option>-->
								</select>
							</div>
						</div>
					</div>
				</div>
			`,
			props: ["self"],
			components: { slideBox, color, xySlider, linearGradient },
			methods: {
				weightAsText(w) {
					return {
						"100": "Thin",
						"100i": "Thin Italic",
						"300": "Light",
						"300i": "Light Italic",
						"400": "Regular",
						"400i": "Regular Italic",
						"500": "Medium",
						"500i": "Medium Italic",
						"700": "Bold",
						"700i": "Bold Italic",
						"900": "Black",
						"900i": "Black Italic"
					}[w];
				}
			},
			mounted() {
				M.FormSelect.init(this.$refs.select);
			},
			computed: {
				variants() {
					let font = getFont(this.self.value);

					setTimeout(() => {
						M.FormSelect.init(this.$refs.select);
					}, 400);

					return font.fonts;
				}
			},
			data: () => {
				return {
					fonts: {
						"google-fonts": {
							hideName: true,
							hideGroupSlot: true,
							default: "Roboto",
							data: data
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