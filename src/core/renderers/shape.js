import Renderer from "../renderer";

import PolyWalk from "../tools/polywalk";

import * as Values from "../values";

export default class Square extends Renderer {
	render(createElement, isMask) {
		let w = this.layer.data.size.value.width;
		let h = this.layer.data.size.value.height;
		let x = this.layer.data.position.value.x - w / 2;
		let y = this.layer.data.position.value.y - h / 2;
		
		let fillAttr = this.layer.data.fill.value.getAttributes(this.layer.id);
		let fillElems = this.layer.data.fill.value.getElements(createElement, this.layer.id);

		let path = new PolyWalk.Path();
		let cx = x + w / 2;
		let cy = y + h / 2;

		let circ = 4*(Math.sqrt(2)-1)/3 + parseFloat(this.layer.data.bulge.value.value);

		let p1 = path.addPoint(cx, cy - h / 2);
		let p2 = path.addPoint(cx + w / 2, cy);
		let p3 = path.addPoint(cx, cy + h / 2);
		let p4 = path.addPoint(cx - w / 2, cy);
		let p5 = path.addPoint(cx, cy - h / 2);
	

		p2.curve.active = true;
		p2.curve.x1 = cx + ((w/2)  * circ);
		p2.curve.y1 = cy - (h/2);

		p2.curve.x2 = cx + (w/2);
		p2.curve.y2 = cy - ((h/2)  * circ);
		

		p3.curve.active = true;
		p3.curve.x1 = cx + (w/2);
		p3.curve.y1 = cy + ((h/2)  * circ);

		p3.curve.x2 = cx + ((w/2)  * circ);
		p3.curve.y2 = cy + (h/2);

		p4.curve.active = true;
		p4.curve.x1 = cx - ((w/2)  * circ);
		p4.curve.y1 = cy + (h/2);

		p4.curve.x2 = cx - (w/2);
		p4.curve.y2 = cy + ((h/2)  * circ);

		p5.curve.active = true;
		p5.curve.x1 = cx - (w/2);
		p5.curve.y1 = cy - ((h/2)  * circ);

		p5.curve.x2 = cx - ((w/2)  * circ);
		p5.curve.y2 = cy - (h/2);


		/*p3.curve.active = true;
		p3.curve.x1 = 250;
		p3.curve.y1 = 100;
		p3.curve.x2 = 250;
		p3.curve.y2 = 200;*/

		//path.addPoint(100, 200);
		//path.close();

		//let walked = path.walk(this.layer.data.path.value.value);

		let elems = [];

		/*if (walked.t) {
			let display = path.displayBezier(walked.t, p1, p2);

			elems = [
				createElement("line", {attrs: {
					x1: display[0].x,
					y1: display[0].y,
					x2: display[2].x,
					y2: display[2].y,
					style: "stroke: red; stroke-width: 2"
				}}),
				createElement("line", {attrs: {
					x1: display[1].x,
					y1: display[1].y,
					x2: display[2].x,
					y2: display[2].y,
					style: "stroke: red; stroke-width: 2"
				}}),
				createElement("line", {attrs: {
					x1: display[3].x,
					y1: display[3].y,
					x2: display[4].x,
					y2: display[4].y,
					style: "stroke: red; stroke-width: 2"
				}})
			];
		}*/

		let totalLength = path.computeLength();

		let spikes = parseInt(this.layer.data.spikes.value.value);

		let dist = spikes;
		let width = totalLength / spikes;
		let off = 0;

		//path.splitPointsAt(0.25, p1, p2);
		console.log(width);

		try {
			throw new Error();
			
			let i = 0;
			while (i < spikes) {
				let pos = off;
				let edge = false;
				let p2o = path.walk(pos + width / 2);
				
				let p1 = path.walk(pos - width / 2);

				edge = p2o.prev.index == p1.next.index;

				let pp1;
				let pp2;
				let curved = false;

				if (p1.next && p1.next.curve.active) {
					curved = true;
					pp1 = p1.split();

					p2o = path.walk(pos + width / 2);
					pp2 = p2o.split();
				}else if (p2o.next && p2o.next.curve.active) {
					pp1 = p1.add();
					p2o = path.walk(pos + width / 2);
					pp2 = p2o.split();
				}else{
					pp1 = p1.add();
				}

				let mid = path.walk(pos);
				mid.next.curve.active = false;
				let pMid;
				if (edge) {
					p1.next.curve.active = false;
					p1.next.x = mid.point.x + Math.cos(mid.normal) * 10;
					p1.next.y = mid.point.y + Math.sin(mid.normal) * 10;
					pMid = p1.next;
				}else{
					pMid = mid.add(mid.point.x + Math.cos(mid.normal) * 10, mid.point.y + Math.sin(mid.normal) * 10);
				}

				off += path.segmentLength(pp1, pMid);
				off += path.segmentLength(pMid, p2o.point);
				//if (curved)
				//	off += path.curveLength(p1.point, pp2);

				pos = off;
				//let p2 = path.walk(pos + width);
				//p2.add(p2o.point.x, p2o.point.y);
				if (!curved)
					path.addPointAt(pMid.index + 1, p2o.point.x, p2o.point.y);
				
				


				i++;
			}
		} catch (e) {
			console.log(e);
		}

		//let walked = path.walk(this.layer.data.path.value.value);
		
		let children = [
			
		];

		let attrs = {};

		if (!isMask)
			attrs = this.mask(createElement, children);
		else
			fillAttr.fill = "black";

		children.push(createElement("path", {
			attrs: Object.assign(fillAttr, attrs, {
				d: path.toSVG()
			})
		}));

		if (isMask) {
			return children[children.length - 1];
		}

		return createElement("g", elems.concat(fillElems.concat(children)));
	}

	defaults() {
		return {
			position: {required: true, value: new Values.Position(256, 256)},
			size: {required: true, value: new Values.Size(100, 100)},
			type: {required: true, value: new Values.Select("Shape", "Circle", ["Circle", "Rectangle", "Triangle", "Hexagon", "Octagon"])},
			path: {required: true, value: new Values.Slider("Walk", 0, -300, 600, 1)},
			spikes: {required: true, value: new Values.Slider("Spike Spacing", 1, 0, 200, 1)},
			spikeWidth: {required: true, value: new Values.Slider("Spike Width", 2, 1, 200, 1)},
			bulge: {required: true, value: new Values.Slider("Bulge", 0, -2, 2, 0.01)},
			fill: new Values.Fill()
		};
	}
}