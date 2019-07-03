import Value from "./value";
import Vue from "vue";

export default class Select extends Value {
	constructor(display, def, options) {
		super();

		this.display = display;
		this.value = def;
		this.options = options;
	}

	render() {
		return {
			template: `
				<div class="row">
					<div class="col s12 input-field white-text">
						<select ref="select" v-model="self.value">
							<option v-for="opt in self.options" :key="opt" :value="opt">{{opt}}</option>
						</select>
						<label>{{self.display}}</label>
					</div>
				</div>
			`,
			props: ["self"],
			mounted() {
				M.FormSelect.init(this.$refs.select);
			}
		};
	}

	compare(other) {
		return this.width == other.width && this.height == other.height;
	}
}