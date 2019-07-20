import Value from "./value";
import xySlider from "../../vue/utils/xySlider.vue";

export default class DualSlider extends Value {
	constructor(displayX, displayY, defx, defy, min, max) {
		super();

		this.displayX = displayX;
		this.displayY = displayY;
		
		this.value = {};

		this.value.x = defx;
		this.value.y = defy;

		this.min = min;
		this.max = max;
	}

	render() {
		return {
			template: `
				<div class="row">
					<xy-slider v-model="self.value" :min="self.min" :max="self.max" :labels="{x: self.displayX, y: self.displayY}" />
				</div>
			`,
			props: ["self"],
			components: { xySlider }
		};
	}

	compare(other) {
		return this.x == other.x && this.y == other.y;
	}
}