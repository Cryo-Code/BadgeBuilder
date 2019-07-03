<template>
	<div class="input-color">
		<div class="color-popover" @mouseup="up(0)" @mousemove="move($event)">
			<div class="color-gradient" :style="'background: rgba(' + hue.r + ', ' + hue.g + ', ' + hue.b + ', 1)'"></div>
			<div ref="grad" class="darkness-gradient" @mousedown="down($event, 1)" :style="'background: linear-gradient(to bottom, transparent 0%, #000 100%), linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(239,1,124,0) 100%);'">
				<div class="color-spot" :style="'top: calc(' + (y * 100) + '% - 6px); left: calc(' + (x * 100) + '% - 6px);'"></div>
			</div>

			<div ref="hue" @mousedown="down($event, 2)" class="color-vertical color-hue">
				<div class="color-spot" :style="'top: calc(' + (huePos * 100) + '% - 6px); left: calc(50% - 6px)'"></div>
			</div>

			<div ref="opacity" @mousedown="down($event, 3)" class="color-vertical color-opacity"><div class="color-back" :style="'background: linear-gradient(to bottom, rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 1) 0%, transparent 100%)'"></div>
				<div class="color-spot" :style="'top: calc(' + (100 - (a * 100)) + '% - 6px); left: calc(50% - 6px)'"></div>
			</div>

			<input ref="hexDisplay" type="text" class="input" @input="updateHex()" :value="hex" style="top: 180px; left: 20px; position: absolute;"/>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		data: {default: false},
		value: {default: "#ffffff"},
		opacity: {default: true},
		output: {default: "rgb"}
	},
	data: () => {
		return {
			huePos: 0,
			hue: {r: 255, g: 255, b: 255},
			a: 1,
			dark: 0,
			light: 0,
			real: "#ffffff",
			out: false,
			isDown: false,
			downOn: 0,
			x: 0, y: 0,
			didChange: false,
			oldHex: "",
			oldRgb: {}
		};
	},
	watch: {
		value: function (nv) {
			if (typeof nv == "string") {
				if (nv == this.hex) // Prevent same values from reseting the oldHex
					return;
			}else if (nv && typeof nv == "object")
				if (nv.r == this.rgb.r && nv.g == this.rgb.g && nv.b == this.rgb.b && nv.a == this.rgb.a)
					return;

			this.setValue(nv);
			this.oldHex = this.hex;
			this.oldRgb = this.rgb;
		}
	},
	computed: {
		hex: function () {
			let r = ("0" + Math.floor(this.rgb.r).toString(16)).slice(-2);
			let g = ("0" + Math.floor(this.rgb.g).toString(16)).slice(-2);
			let b = ("0" + Math.floor(this.rgb.b).toString(16)).slice(-2);
			let a = ("0" + Math.floor(this.a * 255).toString(16)).slice(-2);
			return "#" + r + g + b + a;
		},
		rgb: function () {
			let light = {
				r: this.lerp(255, this.hue.r, this.light),
				g: this.lerp(255, this.hue.g, this.light),
				b: this.lerp(255, this.hue.b, this.light)
			};
			let dark = {
				r: this.lerp(light.r, 0, this.dark),
				g: this.lerp(light.g, 0, this.dark),
				b: this.lerp(light.b, 0, this.dark)
			};
			return {r: dark.r, g: dark.g, b: dark.b, a: this.a};
		}
	},
	created: function () {
		let conv = {r: 255, g: 255, b: 255};
		let value = this.data || this.value || conv;

		this.setValue(value);

		this.oldHex = this.hex;
		this.oldRgb = this.rgb;

		document.addEventListener("mouseup", (e) => {
			if (!e.target.closest(".input-color"))
				this.up(0);
		});
	},
	methods: {
		rgbToHue: (r, g, b) => {
			r = r / 255;
			g = g / 255;
			b = b / 255;
			let max = Math.max(r, g, b);
			let min = Math.min(r, g, b);

			if (min - max == 0)
				return 0;

			if (r == max) {
				return (g - b) / (max - min);
			}else if (g == max) {
				return 2 + (b - r) / (max - min)
			}else if (b == max) {
				return 4 + (r - g) / (max - min);
			}
		},
		rgbToHsl: (r, g, b) => {
			r /= 255, g /= 255, b /= 255;

			let max = Math.max(r, g, b), min = Math.min(r, g, b);
			let h, s, l = (max + min) / 2;

			if (max == min) {
				h = s = 0;
			}else{
				let d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

				switch (max) {
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				}

				h /= 6;
			}

			return [h, s, l];
		},
		updateRgb: function (r, g, b, a) {
			let conv = {r, g, b, a: a || 1};
			this.a = conv.a;
			let hsl = this.rgbToHsl(conv.r, conv.g, conv.b);

			this.huePos = this.rgbToHue(conv.r, conv.g, conv.b)/6;
			if (this.huePos < 0)
				this.huePos = 1 + this.huePos;
			let rgb = this.getRgbAt(this.huePos);

			this.hue.r = Math.floor(rgb.r);
			this.hue.g = Math.floor(rgb.g);
			this.hue.b = Math.floor(rgb.b);

			r = conv.r/255;
			g = conv.g/255;
			b = conv.b/255;

			let max = Math.max(r, g, b);
			let min = Math.min(r, g, b);

			this.y = 1-max;

			if (max == 0)
				this.x = 0;
			else
				this.x = (max-min)/max;

			this.light = this.x;
			this.dark = this.y;
		},
		updateHex: function (hx) {
			let inp = this.$refs.hexDisplay;
			let conv = this.toRgba(hx || inp.value);
			this.updateRgb(conv.r, conv.g, conv.b, conv.a);
		},
		down: function (e, type) {
			this.isDown = true;
			this.downOn = type;
			this.move(e);
		},
		up: function (type) {
			this.isDown = false;
			if (this.didChange) {
				if (this.output == "hex") {
					this.$emit("change", this.oldHex, this.hex);
				}else{
					this.$emit("change", this.oldRgb, this.rgb);
				}
				this.oldHex = this.hex;
				this.oldRgb = this.rgb;
			}
			this.didChange = false;
		},
		move: function (e) {
			if (this.downOn == 1 && this.isDown) {
				let elem = this.$refs.grad;
				let offset = elem.getBoundingClientRect();
				let x = Math.max(0, Math.min(1, (e.clientX - offset.left) / offset.width));
				let y = Math.max(0, Math.min(1, (e.clientY - offset.top) / offset.height));

				this.x = x;
				this.y = y;
				this.light = x;
				this.dark = y;
				this.didChange = true;
			}else if (this.downOn == 2 && this.isDown) {
				let elem = this.$refs.hue;
				let offset = elem.getBoundingClientRect();
				let y = Math.max(0, Math.min(1, (e.clientY - offset.top) / offset.height));
				this.huePos = y;

				let rgb = this.getRgbAt(y);

				this.hue.r = rgb.r;
				this.hue.g = rgb.g;
				this.hue.b = rgb.b;
				this.didChange = true;
			}else if (this.downOn == 3 && this.isDown) {
				let elem = this.$refs.opacity;
				let offset = elem.getBoundingClientRect();
				let y = Math.max(0, Math.min(1, (e.clientY - offset.top) / offset.height));
				this.a = 1 - y;
				this.didChange = true;
			}

			if (this.isDown) {
				this.$emit("input", this.getValue());
			}
		},
		getRgbAt: function (stop) {
			stop = stop || 0;
			
			let stops = [
				[255, 0, 0],
				[255, 255, 0],
				[0, 255, 0],
				[0, 255, 255],
				[0, 0, 255],
				[255, 0, 255],
				[255, 0, 0]
			];

			let mul = stop * (stops.length - 1);
			let pos = Math.floor(mul);
			let point = mul - pos;


			let start = stops[pos];
			let end = stops[pos + 1] || stops[0];

			let lerp = this.lerp;

			let r = lerp(start[0], end[0], point);
			let g = lerp(start[1], end[1], point);
			let b = lerp(start[2], end[2], point);

			return {r, g, b};
		},
		lerp: (a, b, c) => {
			return (1 - c) * a + c * b;
		},
		toRgba: function (hex) {
			let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
				a: parseInt(result[4] || "ff", 16) / 255
			} : {r: 255, g: 255, b: 255};
		},
		setValue: function (value) {
			if (typeof value == "string")
				this.updateHex(value);
			else if (typeof value == "object") {
				if (Array.isArray(value))
					this.updateRgb(...value);
				else
					this.updateRgb(value.r, value.g, value.b, value.a || 1);
			}else throw new Error("Invalid type " + (typeof value) + " passed into color");
		},
		getValue: function (done) {
			let out = this.rgb;
			if (this.output == "hex")
				out = this.hex;
			
			if (done)
				done(out);
			return out;
		}
	}
}

</script>

<style lang="less">
	.input-color {
		position: relative;

		user-select: none;

		.color-spot {
			position: absolute;
			background: transparent;
			border: 1px solid white;
			box-shadow: black 0px 0px 2px;
			width: 10px;
			height: 10px;
			border-radius: 100%;
		}

		.input-color-display {
			width: 2em;
			height: 1em;
			border-radius: 3px;
		}

		.color-popover {
			width: 290px;
			height: 250px;
		}

		.color-gradient {
			border-radius: 3px;
			margin-top: 0;
			margin-left: 1.5em;
			top: 0;
			left: 0;
			width: 150px;
			height: 150px;
			box-shadow: #b9b9b9 0px 0px 0px 1px;
		}

		.darkness-gradient {
			border-radius: 3px;
			position: absolute;
			top: 0;
			left: 1.5em;
			width: 150px;
			height: 150px;
		}

		.color-hue {
			box-shadow: #b9b9b9 0px 0px 0px 1px;
			border-radius: 3px;
			position: absolute;
			left: 200px;
			top: 0;
			width: 20px;
			height: 150px;
			background: linear-gradient(to bottom, red 0%, #ff0 17%, lime 33%, cyan 50%, blue 66%, #f0f 83%, red 100%);
		}

		.color-opacity {
			box-shadow: #b9b9b9 0px 0px 0px 1px;
			border-radius: 3px;
			position: absolute;
			left: 250px;
			top: 0;
			width: 20px;
			height: 150px;
			background-image: linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
			background-size: 20px 20px;
			background-position: 0 0, 0 10px, 10px -10px, -10px 0px;

			.color-back {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(to bottom, white 0%, transparent 100%);
			}
		}
	}
</style>