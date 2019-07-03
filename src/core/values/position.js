import Value from "./value";

export default class Position extends Value {
	constructor(x, y) {
		super();

		this.x = x;
		this.y = y;
	}

	render() {
		return {
			template: `
				<div class="row">
					<datalist id="ticks">
						<option>256</option>
					</datalist>
					<div class="col s6">
						<label>X</label>
						<input type="number" v-model.number="self.x"/>
						<input type="range" list="ticks" min="0" max="512" v-model.number="self.x" />
					</div>
					<div class="col s6">
						<label>Y</label>
						<input type="number" v-model.number="self.y"/>
						<input type="range" list="ticks" min="0" max="512" v-model.number="self.y" />
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