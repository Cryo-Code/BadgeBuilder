<template>
	<div class="layers">
		<svg class="svg">
			<g v-for="layer in workspace.layers" :key="layer.id">

			</g>
		</svg>
		<transition-group name="layer-list" tag="div">
			<layer @list-move="move($event, i)" v-for="(v, i) in workspace.layers" :i="i" :workspace.sync="workspace" :key="v.id" :layer.sync="v"/>
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
				this.workspace.layers.splice(toIndex, 0, this.workspace.layers.splice(index, 1)[0]);
			}
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

	.layers {
		.svg {
			position: absolute;

			top: 0;
			left: 0;
			height: 100%;
			width: 30px;
		}
	}
</style>