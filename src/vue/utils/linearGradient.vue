<template>
	<div style="display: flex; flex-direction: column; align-items: center;">
		<div>
			<button @click="real.stops.push(['#FFFFFF', 0.5])" class="waves-effect btn-flat">
				Add Stop
			</button>
			<button @click="real.stops.splice(showPicker, 1), showPicker = null" class="waves-effect btn-flat" :class="{disabled: showPicker === null || real.stops.length <= 2}">
				Remove Stop
			</button>
		</div>
		<div class="gradient-grid" :style="'background: ' + cssGradient" @mousedown="downGrid" @mouseup="upGrid" @mousemove="moveGrid">
			<div class="center-dot" ref="centerDot"></div>
			<div class="line" :style="'transform: rotate(' + real.angle + 'deg)'">
				<div class="start-dot" ref="startDot"></div>
				<div v-for="(v, i) in real.stops" :key="i" class="stop" :class="{moving: mouse.down, 'show-color': showPicker === i}" @mouseup="upStop($event, i)" @mousedown="downStop($event, i)" :style="'left: calc(' + (v[1] * 100) + '% - 6px); transform: rotate(' + (-real.angle) + 'deg)'">
					<div style="z-index: 100; background: #2b2b2b; padding: 5px;">
						<color output="hex" v-model="v[0]" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import color from "./color.vue";

	export default {
		data: () => {
			return {
				real: {
					angle: 0,
					stops: [
						["#FFFFFF", 0],
						["#000000", 1]
					]
				},
				mouse: {
					down: false,
					downStop: null
				},
				moved: false,
				showPicker: null,
				debug: {
					hyp: 0,
					hypLen: 0,
					op: 0,
					opLen: 0
				}
			};
		},
		props: ["value"],
		watch: {
			value(v) {
				this.inputValue(v);
			}
		},
		computed: {
			cssGradient() {
				let sorted = this.real.stops.slice(0, this.real.stops.length).sort((a, b) => a[1] - b[1]);

				return `linear-gradient(${this.real.angle + 90}deg, ${sorted.map((s) =>
					`${s[0]} ${s[1] * 100}%`
				).join(", ")})`;
			}
		},
		methods: {
			inputValue(v) {
				this.real.angle = v.angle || 0;
				
				if (v.stops)
					this.real.stops = v.stops;
			},
			upGrid(e) {
				this.mouse.down = false;
				this.mouse.downStop = null;
			},
			upStop(e, stop) {
				if (!this.moved)
					this.showPicker = stop;
			},
			downGrid(e) {
				this.moved = false;

				if (e.target.classList.contains("gradient-grid"))
					this.mouse.down = true;
			},
			downStop(e, stop) {
				if (this.showPicker !== null)
					return;

				this.moved = false;

				this.mouse.down = true;
				this.mouse.downStop = stop;
			},
			moveGrid(e) {
				this.moved = true;

				// Rotate Gradient
				if (e.target.classList.contains("gradient-grid") && this.mouse.down && this.mouse.downStop === null) {
					let center = this.$refs.centerDot.getBoundingClientRect();
					let dx = center.left - e.clientX;
					let dy = center.top - e.clientY;
					let angle = Math.atan2(dy, dx) * (180 / Math.PI);

					this.real.angle = angle - 180;
				}else if (this.mouse.down && this.mouse.downStop !== null) { // Move stop
					let start = this.$refs.startDot.getBoundingClientRect();
					let dx = start.left - e.clientX;
					let dy = start.top - e.clientY;
					let dist = Math.sqrt(dx*dx + dy*dy);

					let angle = this.real.angle / (180 / Math.PI);
					
					let interiorAngle = Math.atan2(dy, dx);
					
					let cos = Math.cos(angle - interiorAngle);
					let rec = 1/dist;

					let adjLen = cos/rec;
					
					this.real.stops.splice(this.mouse.downStop, 1,
						[
							this.real.stops[this.mouse.downStop][0],
							Math.max(0, Math.min(1, Math.abs(adjLen) / 200))
						]
					);
				}

				this.$emit("input", this.real);
			}
		},
		created() {
			this.inputValue(this.value);

			this.clickListener = (e) => {
				if (!e.target.closest(".input-color, .stop"))
					this.showPicker = null;
			};

			this.upListener = (e) => {
				this.mouse.down = false;
				this.mouse.downStop = null;
			};

			document.addEventListener("click", this.clickListener);
			document.addEventListener("mouseup", this.clickListener);
		},
		beforeDestroy() {
			document.removeEventListener("click", this.clickListener);
			document.removeEventListener("mouseup", this.clickListener);
		},
		components: { color }
	}
</script>

<style lang="less">
	.gradient-grid {
		user-select: none;
		width: 200px;
		height: 200px;
		position: relative;

		.line {
			position: absolute;
			border-top: 1px solid white;
			border-bottom: 1px solid white;
			width: 100%;
			top: 50%;
			left: calc(50%-100px);

			.stop {
				position: absolute;
				border-radius: 50%;
				border: 1px solid white;
				padding: 6px;
				top: -6px;
				transition: .3s;

				> div {
					transition: .3s;
					pointer-events: none;
					opacity: 0;
					position: absolute;
					left: -100px;
					top: -20px;
				}

				&:not(.moving).show-color {
					transform: scale(1.2);

					& > div {
						pointer-events: all;
						opacity: 1;
					}
				}
			}
		}

		.center-dot {
			position: absolute;
			top: 50%;
			left: 50%;
		}

		.start-dot {
			position: absolute;
			top: 50%;
			left: 0%;
		}
	}
</style>