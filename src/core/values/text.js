import Value from "./value";

export default class Text extends Value {
	constructor(text) {
		super();

		this.text = text || "";
	}

	render() {
		return {
			template: `
				<div class="row">
					<div class="col s12">
						<label>Text</label>
						<input type="text" v-model="self.text" />
					</div>
				</div>
			`,
			props: ["self"]
		};
	}

	compare(other) {
		return this.text == other.text;
	}
}