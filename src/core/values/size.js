import Value from "./value";
import Vue from "vue";

export default class Size extends Value {
	constructor(w, h) {
		super();

		this.width = w;
		this.height = h;
	}

	render() {
		return {
			template: `
				<div class="row">
					<div class="col s6">
						<label>Width</label>
						<input type="number" v-model.number="self.width"/>
						<datalist id="width-snap">
							<option>{{self.height}}</option>
						</datalist>
						<input type="range" min="0" max="1024" list="width-snap" v-model.number="self.width" />
					</div>
					<div class="col s6">
						<label>Height</label>
						<input type="number" v-model.number="self.height"/>
						<datalist id="height-snap">
							<option>{{self.width}}</option>
						</datalist>
						<input type="range" min="0" max="1024" list="height-snap" v-model.number="self.height" />
					</div>
				</div>
			`,
			props: ["self"]
		};
	}

	compare(other) {
		return this.width == other.width && this.height == other.height;
	}
}