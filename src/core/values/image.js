import Value from "./value";

import slideBox from "../../vue/utils/slideBox.vue";

export default class Image extends Value {
	constructor() {
		super();

		this.type = "local";

		this.value = "resources/textures/1.jpg";
	}

	render() {
		return {
			template: `
				<div>
					<label>Image</label>

					<slide-box v-model="self" :data="images">
						<template v-slot:local="slotProps">
							<div class="slide-block"><img :src="slotProps.data.value" :style="'max-width: 100%; max-height: 100%;'"/></div>
						</template>
					</slide-box>
				</div>
			`,
			props: ["self"],
			components: { slideBox },
			data: () => {
				return {
					images: {
						"local": {
							default: "resources/textures/1.jpg",
							data: [
								{name: "Scratches 1", value: "resources/textures/1.jpg", meta: {slot: "image"}},
								{name: "Scratches 2", value: "resources/textures/2.jpg"},
								{name: "Scratches 3", value: "resources/textures/3.jpg"},
								{name: "Scratches 4", value: "resources/textures/4.jpg"},
								{name: "Scratches 5", value: "resources/textures/5.jpg"},
								{name: "Marble 1", value: "resources/textures/marble.jpg"},
								{name: "Smudge 1", value: "resources/textures/smudge1.jpg"},
								{name: "Grundge", value: "resources/textures/vertical-grundge.jpg"}
							]
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