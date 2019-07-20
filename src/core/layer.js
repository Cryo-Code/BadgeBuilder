import { Renderer } from "./index";
import Value from "./values/value";

export default class Layer {
	constructor(renderer, workspace) {
		this.name = "Layer";

		this.workspace = workspace;

		this.renderer = renderer || new Renderer(this);
		this.doDefaults();

		this.id = 0;

		this.masks = {
			negative: [],
			add: []
		}
	}

	setRenderer(r) {
		if (typeof r == "function") {
			this.renderer = new r(this);
		}else{
			r.layer = this;
			this.renderer = r;
		}

		this.doDefaults();
	}

	doDefaults() {
		let d = this.renderer.defaults();
		this.data = {};

		for (let k in d) {
			if (d[k] instanceof Value)
				this.data[k] = {active: true, required: false, value: d[k]};
			else
				this.data[k] = Object.assign({active: true, required: false}, d[k]);
		}
	}
};