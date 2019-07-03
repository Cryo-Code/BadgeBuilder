let PolyWalk = {};

PolyWalk.Point = class PolyWalkPoint {
	constructor(path, index, x, y) {
		this.x = x;
		this.y = y;
		this.close = false;

		this.curve = {
			active: false,
			type: "cubic",
			x1: 0,
			y1: 0,
			x2: 0,
			y2: 0
		};

		this.index = index;

		this.path = path;
	}

	copy() {
		return new PolyWalk.Point(this.x, this.y);
	}
}

PolyWalk.Path = class PolyWalkPath {
	constructor() {
		this.points = [];

		this.cursor = 0;
	}

	lerp(t, a, b) {
		return a + t * (b - a);
	}

	lerpPosition(t, x1, y1, x2, y2) {
		return {x: this.lerp(t, x1, x2), y: this.lerp(t, y1, y2)};
	}

	segmentLength(p1, p2) {
		let dx = p1.x - p2.x,
			dy = p1.y - p2.y;
		
		return Math.sqrt(dx * dx + dy * dy);
	}

	addPoint(x, y) {
		let p = new PolyWalk.Point(this, this.points.length, x, y);
		this.points.push(p);

		return p;
	}

	addPointAt(index, x, y) {
		let p = new PolyWalk.Point(this, index, x, y);
		this.points.splice(index, 0, p);

		for (let i = index; i < this.points.length; i++)
			this.points[i].index = i;

		return p;
	}

	walk(dist) {
		return this.computePointAlong(dist);
	}

	cubicBezier(t, p1, p2) {
		let lP1 = this.lerpPosition(t, p1.x, p1.y, p2.curve.x1, p2.curve.y1);
		let rP1 = this.lerpPosition(t, p2.curve.x2, p2.curve.y2, p2.x, p2.y);
		
		let topPosition = this.lerpPosition(t, p2.curve.x1, p2.curve.y1, p2.curve.x2, p2.curve.y2);

		let tlP = this.lerpPosition(t, lP1.x, lP1.y, topPosition.x, topPosition.y);
		let trP = this.lerpPosition(t, topPosition.x, topPosition.y, rP1.x, rP1.y);

		return this.lerpPosition(t, tlP.x, tlP.y, trP.x, trP.y);
	}

	displayBezier(t, p1, p2) {
		let lP1 = this.lerpPosition(t, p1.x, p1.y, p2.curve.x1, p2.curve.y1);
		let rP1 = this.lerpPosition(t, p2.curve.x2, p2.curve.y2, p2.x, p2.y);
		
		let topPosition = this.lerpPosition(t, p2.curve.x1, p2.curve.y1, p2.curve.x2, p2.curve.y2);

		let tlP = this.lerpPosition(t, lP1.x, lP1.y, topPosition.x, topPosition.y);
		let trP = this.lerpPosition(t, topPosition.x, topPosition.y, rP1.x, rP1.y);

		return [
			lP1,
			rP1,
			topPosition,
			tlP,
			trP,
			this.lerpPosition(t, tlP.x, tlP.y, trP.x, trP.y)
		];
	}

	splitPointsAt(t, p1, p2) {
		let newPointData = this.splitBezier(t, p1, p2);
		//let newPointPos = this.walkCurve(t, p1, p2);
		let newPoint = this.addPointAt(p1.index + 1, newPointData[3].x, newPointData[3].y);
		newPoint.curve.active = true;

		newPoint.curve.x1 = newPointData[1].x;
		newPoint.curve.y1 = newPointData[1].y;
		newPoint.curve.x2 = newPointData[2].x;
		newPoint.curve.y2 = newPointData[2].y;

		let lastPointData = this.splitBezier(1-t, p1, p2, true);

		p2.curve.x1 = lastPointData[2].x;
		p2.curve.y1 = lastPointData[2].y;
		p2.curve.x2 = lastPointData[1].x;
		p2.curve.y2 = lastPointData[1].y;

		return newPoint;
	}

	splitBezier(t, p1, p2, rev) {
		let x1 = p1.x, y1 = p1.y;
		let x2 = p2.curve.x1, y2 = p2.curve.y1;
		let x3 = p2.curve.x2, y3 = p2.curve.y2;
		let x4 = p2.x, y4 = p2.y;

		if (rev) {
			x1 = p2.x;
			y1 = p2.y;
			
			x2 = p2.curve.x2;
			y2 = p2.curve.y2;
			x3 = p2.curve.x1;
			y3 = p2.curve.y1;

			x4 = p1.x;
			y4 = p1.y;
		}

		let x12 = (x2-x1)*t+x1;
		let y12 = (y2-y1)*t+y1;

		let x23 = (x3-x2)*t+x2;
		let y23 = (y3-y2)*t+y2;

		let x34 = (x4-x3)*t+x3;
		let y34 = (y4-y3)*t+y3;

		let x123 = (x23-x12)*t+x12;
		let y123 = (y23-y12)*t+y12;

		let x234 = (x34-x23)*t+x23;
		let y234 = (y34-y23)*t+y23;

		let x1234 = (x234-x123)*t+x123;
		let y1234 = (y234-y123)*t+y123;

		return [{x: x1, y: y1}, {x: x12, y: y12}, {x: x123, y: y123}, {x: x1234, y: y1234}];
	}

	curveLength(p1, p2) {
		let interval = 0.001;

		let len = 0;
		let lastPoint = this.cubicBezier(0, p1, p2);

		for (let i = 0; i < 1; i += interval) {
			let point = this.cubicBezier(i, p1, p2);
			len += this.segmentLength(lastPoint, point);
			lastPoint = point;
		}

		return len;
	}

	walkCurve(dist, p1, p2) {
		let interval = 0.001;

		let len = 0;
		let lastPoint = this.cubicBezier(0, p1, p2);

		for (let i = 0; i < 1; i += interval) {
			let point = this.cubicBezier(i, p1, p2);
			len += this.segmentLength(lastPoint, point);

			let dx = lastPoint.x - point.x;
			let dy = lastPoint.y - point.y;
			point.direction = Math.atan2(dy, dx);
			point.t = i;
			lastPoint = point;

			if (dist <= len)
				return point;
		}

		return p2;
	}

	computeLength() {
		let length = 0;
		let lastPoint = this.points[0];
		
		for (let i = 1; i < this.points.length; i++) {
			let point = this.points[i];

			if (point.curve.active) {
				let curve = this.curveLength(lastPoint, point);
				length += curve;
				lastPoint = point;
			}else{
				let segment = this.segmentLength(lastPoint, point);
				length += segment;

				lastPoint = point;
			}
		}

		return length;
	}

	computePointAlong(dist) {
		if (this.points.length < 1) {
			throw new Error("Not enough points");
		}

		if (dist == 0)
			return {
				point: this.points[0],
				add: (x, y) => {
					x = x || this.points[0].x;
					y = y || this.points[0].y;
					
					return this.addPointAt(1, x, y);
				},
				normal: 0,
				next: this.points[1],
				t: 0,
				prev: this.points[0]
			};

		let length = 0;
		let lastPoint = this.points[0];

		let direction = 1;
		let initial = 1;

		if (dist < 0) {
			//direction = -1;
			//initial = this.points.length - 1;
			
			dist = this.computeLength() - Math.abs(dist);
		}
		
		for (let i = initial; (dist < 0) ? (i > 0) : (i < this.points.length); i += direction) {
			let point = this.points[i];

			if (point.curve.active) {
				let curve = this.curveLength(lastPoint, point);
				length += curve;

				if (Math.abs(dist) < length) {
					let distBetween = Math.abs(length - curve - Math.abs(dist));

					let pointOnCurve = this.walkCurve(distBetween, lastPoint, point);

					return {
						next: this.points[i],
						prev: this.points[i - 1],
						point: pointOnCurve,
						t: pointOnCurve.t,
						direction: pointOnCurve.direction,
						normal: pointOnCurve.direction + Math.PI / 2,
						add: (x, y) => {
							x = x || pointOnCurve.x;
							y = y || pointOnCurve.y;
							
							return this.addPointAt(i, x, y);
						},
						split: (x, y) => {
							return this.splitPointsAt(pointOnCurve.t, lastPoint, point);
						}
					}
				}else{
					lastPoint = point;
				}
			}else{
				let segment = this.segmentLength(lastPoint, point);
				length += segment;

				if (Math.abs(dist) < length) { // The compute point is between lastPoint and point
					// Get the distance from the start of this segment
					let distBetween = Math.abs(length - segment - Math.abs(dist));

					// Convert length to an interval between 0 and 1
					let t = distBetween / segment;

					let pointOnSegment = this.lerpPosition(t, lastPoint.x, lastPoint.y, point.x, point.y);

					return {
						point: pointOnSegment,
						next: point,
						prev: this.points[i - 1],
						direction: Math.atan2(lastPoint.y - point.y, lastPoint.x - point.x),
						add: (x, y) => {
							x = x || pointOnSegment.x;
							y = y || pointOnSegment.y;
							
							return this.addPointAt(i, x, y);
						},
						split: (x, y) => {
							x = x || pointOnSegment.x;
							y = y || pointOnSegment.y;
							
							return this.addPointAt(i, x, y);
						},
						normal: Math.atan2(lastPoint.y - point.y, lastPoint.x - point.x) + Math.PI / 2
					};
				}else{
					lastPoint = point;
				}
			}
		}

		return this.computePointAlong(dist - length);
	}

	close() {
		let p = this.addPoint(this.points[0].x, this.points[0].y);
		p.close = true;
	}

	toSVG() {
		let str = "";

		for (let [i, point] of this.points.entries())
			if (i == 0)
				str += "M " + point.x + " " + point.y;
			else
				if (point.curve.active)
					str += " C " + point.curve.x1 + " " + point.curve.y1 + " " + point.curve.x2 + " " + point.curve.y2 + " " + point.x + " " + point.y;
				else if (point.close)
					str += " Z";
				else
					str += " L " + point.x + " " + point.y;
		
		return str;
	}
}

export default PolyWalk;