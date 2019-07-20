<template>
	<div class="layers">
		<svg class="svg" :style="'height: ' + layersHeight">
			<path ref="p" fill="transparent"/>
			<g v-for="layer in workspace.layers" :key="layer.id">
				<template >
					<circle @mousedown="clickDown(layer.id, 'add', $event)" :ref="'c1-' + layer.id" r="7" fill="lime"></circle>
					<circle @mousedown="clickDown(layer.id, 'negative', $event)" :ref="'c2-' + layer.id" r="7" fill="red"></circle>
				</template>
				<path class="mask-connection" v-for="(v, i) in layer.masks.add" :key="i" stroke="dodgerblue" fill="transparent" :ref="'pa-' + layer.id + '-' + i" />
				<path class="mask-connection" v-for="(v, i) in layer.masks.negative" :key="i" stroke="dodgerblue" fill="transparent" :ref="'pn-' + layer.id + '-' + i" />
			</g>
		</svg>
		<transition-group name="layer-list" tag="div" class="layer-container">
			<layer @mouseleave="hover = false" @mouseenter="hoverEnter(v.id)" @list-move="move($event, i)" v-for="(v, i) in workspace.layers" :i="i" :workspace.sync="workspace" :ref="v.id" :key="v.id" :layer.sync="v"/>
		</transition-group>
	</div>
</template>

<script>
	import layer from "./layer.vue";

	export default {
		props: ["workspace"],
		components: {
			layer
		},
		methods: {
			move: function (px, index) {
				let toIndex = Math.max(0, Math.min(Math.round(px / 75), this.workspace.layers.length - 1));
				//workspace.layers.splice(toIndex, workspace.layers[index]);
				if (index != toIndex) {
					this.workspace.layers.splice(toIndex, 0, this.workspace.layers.splice(index, 1)[0]);
				}
			},
			clickDown(id, type, e) {
				if (e.button == 2) {
					e.preventDefault();
					let layer = this.workspace.getLayer(id);
					layer.masks[type].splice(0, layer.masks[type].length);
				}else{
					this.downOn.layer = id;
					this.downOn.type = type;
					this.down = true;
				}
			},
			hoverEnter(id) {
				this.hover = true;
				this.hoverOn.layer = id;
			}
		},
		data() {
			return {
				layerPositions: {},
				layersHeight: 100,
				mouse: {x: 0, y: 0},
				down: false,
				downOn: {layer: 0, type: "add"},
				hover: false,
				hoverOn: {layer: 0}
			}
		},
		mounted() {
			let anim = () => {
				requestAnimationFrame(anim);

				this.layersHeight = this.$el.scrollHeight;
				let layerScroll = this.$el.scrollTop;

				let layers = this.$el.getBoundingClientRect();
				if (this.down) {
					this.$refs.p.style.stroke = "dodgerblue";
				}else{
					this.$refs.p.style.stroke = "transparent";
				}

				for (let layerId in this.$refs) {
					if (layerId[0] == "c" || layerId[0] == "p")
						continue;

					let ref = this.$refs[layerId];

					if (!(layerId in this.layerPositions))
						this.layerPositions[layerId] = {x: 0, y: 0};
					
					let layer = ref[0].$el.getBoundingClientRect();

					let positions = {
						add: {x: 0, y: 0},
						negative: {x: 0, y: 0}
					}

					let realLayer = null;

					for (let wLayer of this.workspace.layers)
						if (wLayer.id == layerId)
							realLayer = wLayer;

					if (this.$refs["c1-" + layerId]) {
						this.$refs["c1-" + layerId][0].cx.baseVal.value = layer.left - layers.left;
						this.$refs["c1-" + layerId][0].cy.baseVal.value = layerScroll + layer.top - layers.top + 37.5 - 20;

						positions.add.x = layer.left - layers.left;
						positions.add.y = layer.top - layers.top + 37.5 - 20;

						this.$refs["c1-" + layerId][0].style.display = this.workspace.selection.indexOf(realLayer) == -1 ? "none" : "inherit";
					}

					if (this.$refs["c2-" + layerId]) {
						this.$refs["c2-" + layerId][0].cx.baseVal.value = layer.left - layers.left;
						this.$refs["c2-" + layerId][0].cy.baseVal.value = layerScroll +  layer.top - layers.top + 37.5 + 20;

						positions.negative.x = layer.left - layers.left;
						positions.negative.y = layer.top - layers.top + 37.5 + 20;

						this.$refs["c2-" + layerId][0].style.display = this.workspace.selection.indexOf(realLayer) == -1 ? "none" : "inherit";
					}

					if (this.down && this.downOn.layer == layerId) {
						let pos = positions[this.downOn.type];

						let offX = this.mouse.x - layers.left;
						let offY = this.mouse.y - layers.top;

						if (this.hover) {
							let hoverRect = this.$refs[this.hoverOn.layer][0].$el.getBoundingClientRect();
							offX = hoverRect.left - layers.left;
							offY = hoverRect.top - layers.top + 37.5;
						}

						this.$refs.p.setAttribute("d", `M ${pos.x} ${layerScroll + pos.y} C ${pos.x - 20} ${layerScroll + pos.y} ${offX - 20} ${layerScroll + offY} ${offX} ${layerScroll + offY}`);
					}

					let renderMaskPath = (type, pos, i, m) => {
						let rect = this.$el.querySelector("[data-layer-id=\"" + m.layer + "\"]").getBoundingClientRect();
						let offX = rect.left - layers.left;
						let offY = rect.top - layers.top + 37.5;

						if (this.$refs["p" + type + "-" + layerId + "-" + i])
							this.$refs["p" + type + "-" + layerId + "-" + i][0].setAttribute("d", `
								M ${pos.x} ${layerScroll + pos.y} C ${pos.x - 20} ${layerScroll + pos.y} ${offX - 20} ${layerScroll + offY} ${offX} ${layerScroll + offY}
							`);
					};

					for (let i = 0; i < realLayer.masks.add.length; i++) {
						renderMaskPath("a", positions.add, i, realLayer.masks.add[i]);
					}

					for (let i = 0; i < realLayer.masks.negative.length; i++) {
						renderMaskPath("n", positions.negative, i, realLayer.masks.negative[i]);
					}
				}
			};

			requestAnimationFrame(anim);

			document.addEventListener("mouseup", (e) => {
				if (this.down && this.hover) {
					console.log("Added mask");

					let realLayer = null;

					for (let wLayer of this.workspace.layers)
						if (wLayer.id == this.downOn.layer)
							realLayer = wLayer;

					realLayer.masks[this.downOn.type].push({layer: this.hoverOn.layer});
				}

				this.down = false;
			});

			document.addEventListener("mousemove", (e) => {
				this.mouse.x = e.clientX;
				this.mouse.y = e.clientY;
			})
		}
	}
</script>

<style lang="less">
	.layer:not(.moving) {
		transition: border .3s, transform .3s, background .3s, margin .3s;
	}

	.layer.moving {
		transition: border .3s, background .3s, margin .3s;
	}

	.layer {
		touch-action: none;
	}

	.layer.moving {
		z-index: 10;
		background: #3f3f3f;
		margin-left: -30px;
	}

	.layers {
		position: relative;

		overflow: auto;

		> div {
			margin-left: 30px;
		}
	}

	.layer-container {
		position: absolute;
		width: calc(100% - 30px);
		z-index: 10;
	}

	.layers {
		.svg {
			z-index: 5;
			position: absolute;

			top: 0;
			left: 0;
			height: 100%;
			width: 40px;
		}
	}

	.mask-connection {
		pointer-events: none;
	}
</style>