import Value from "./value";

export default class Slider extends Value {
	constructor(display, def, min, max, step) {
		super();

		step = step || 1;

		this.display = display;
		this.value = def;
		this.min = min;
		this.max = max;
		this.step = step;
	}

	render() {
		return {
			template: `
				<div class="row">
					<datalist id="ticks">
						<option>256</option>
					</datalist>
					<div class="col s12">
						<label>{{self.display}}</label>
						<input type="number" v-model.number="self.value"/>
						<input type="range" :step="self.step" :min="self.min" :max="self.max" v-model.number="self.value" />
					</div>
				</div>
			`,
			props: ["self"]
		};
	}

	compare(other) {
		return this.x == other.x && this.y == other.y;
	}
}