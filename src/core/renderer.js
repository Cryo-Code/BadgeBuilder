export default class Renderer {
	constructor(layer) {
		this.layer = layer;
	}
	
	render(createElement) {
		return createElement("g", [
			createElement("rect", {
				attrs: {
					x: "0",
					y: "0",
					width: "100",
					height: "100"
				}
			}
		)]);
	}

	defaults() {
		return {};
	}
};