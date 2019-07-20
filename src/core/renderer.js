export default class Renderer {
	constructor(layer) {
		this.layer = layer;
	}

	mask(createElement, children) {
		let negativeMask = [];
		let addClips = [];

		for (let mask of this.layer.masks.negative) {
			negativeMask.push(
				this.layer.workspace.getLayer(mask.layer)
				.renderer.render(createElement, true)
			);
		}

		for (let mask of this.layer.masks.add) {
			addClips.push(
				this.layer.workspace.getLayer(mask.layer)
				.renderer.render(createElement, true)
			);
		}

		let defsChildren = [];

		let attrs = {};

		if (negativeMask.length > 0) {
			negativeMask.unshift(createElement("rect", {
				attrs: {
					fill: "white",
					x: 0,
					y: 0,
					width: 512,
					height: 512
				}
			}));

			defsChildren.push(createElement("mask", {
				attrs: {
					id: "layer-mask-" + this.layer.id
				}
			}, negativeMask));

			attrs["mask"] = `url(#layer-mask-${this.layer.id})`;
		}

		if (addClips.length > 0) {
			defsChildren.push(createElement("clipPath", {
				attrs: {
					id: "layer-clip-" + this.layer.id
				}
			}, addClips));

			attrs["clip-path"] = `url(#layer-clip-${this.layer.id})`;
		}

		if (defsChildren.length > 0) {
			children.push(createElement("defs", defsChildren));
		}
		
		return attrs;
	}
	
	render(createElement, isMask) {
		let children = [];

		let attrs = {};

		if (!isMask)
			attrs = this.mask(createElement, children);

		children.push(createElement("rect", {
			attrs: Object.assign(attrs, {
				x: "0",
				y: "0",
				width: "100",
				height: "100"
			})
		}));

		if (isMask)
			return children[0];

		return createElement("g", children);
	}

	defaults() {
		return {};
	}
};