<template>
	<div class="app">
		<div class="main-panel">
			<div class="zoom-panel" ref="zoom">
				<viewer :workspace="workspace" :layers="workspace.layers"/>
			</div>
			<div class="toolbox" :class="{open: toolbox}">
				<div class="toolbox-title btn waves-effect waves-light blue" @click="toolbox = !toolbox">
					<i class="material-icons left" :style="toolbox ? 'transform: rotate(45deg)' : ''">add</i> {{ toolbox ? "Close" : "Add" }}
				</div>
				<div class="toolbox-content">
					<div v-for="preset in presets" @click="addLayer(preset)" class="preset card hoverable" :key="preset.title">
						<div class="display">
							<i v-if="preset.display.type == 'icon'" class="material-icons">{{preset.display.icon}}</i>
							<div v-else-if="preset.display.type == 'raw'" v-html="preset.display.html"></div>
						</div>
						<div class="title">
							{{preset.title}}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="right-panel">
			<properties class="properties" :workspace="workspace" :selection="workspace.selection"/>
			<layers class="layers" :workspace="workspace"/>
		</div>
	</div>
</template>

<script>
	import layers from "./layers.vue";
	import properties from "./properties.vue";
	import viewer from "./viewer.vue";
	import * as BadgeBuilder from "../core";
	import panzoom  from "panzoom";

	import presets from "../core/presets";

	import Square from "../core/renderers/square";
	import Shape from "../core/renderers/shape";

	export default {
		data: () => {
			let workspace = {
				layers: [],
				selection: [],
				layerIndex: 0
			};
			
			return {
				theme: "dark",
				workspace: workspace,
				toolbox: false,
				presets: presets
			};
		},
		components: {
			layers,
			properties,
			viewer
		},
		mounted() {
			panzoom(this.$refs.zoom);
		},
		methods: {
			addLayer(preset) {
				let newLayer = new BadgeBuilder.Layer();

				newLayer.id = this.workspace.layerIndex++;

				newLayer.name = preset.title + " " + newLayer.id;

				newLayer.setRenderer(preset.create());
				this.workspace.layers.push(newLayer);
			}
		}
	}
</script>


<style lang="less">
	html, body {
		overflow: hidden;
	}

	::-webkit-scrollbar {
		width: 10px;
	}

	::-webkit-scrollbar-track {
		background: var(--background); 
	}

	::-webkit-scrollbar-thumb {
		background: #2b2b2b;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #555; 
	}
	
	:root {
		--background: rgb(32, 32, 32);
	}

	.color-checker-background {
		background-image: linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
		background-size: 20px 20px;
		background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
	}

	.app {
		input[type="text"] {
			color: white;
		}

		input.select-dropdown {
			color: white;
		}

		.select-wrapper svg {
			fill: white;
		}

		.select-wrapper {
			ul {
				background: #2b2b2b;

				li {
					span {
						color: #5bacfb;
					}
				}
			}
		}

		.row {
			margin: 0;
		}

		input[type=number] {
			height: 18px;
			color: white;
			margin: 0;
		}

		input[type=range] {
			border-color: rgb(66, 66, 66);
			margin: 0;
			border: none;
			height: 12px;
		}

		display: flex;

		height: 100%;
		width: 100%;

		background: var(--background);

		.right-panel {
			flex: 2;

			min-width: 350px;

			display: flex;
			flex-direction: column;

			border-left: 1px solid #3c3c3c;

			.layers {
				flex: 2;

				min-height: 400px;
				max-height: 400px;

				overflow-y: auto;

				padding-top: 30px;
				border-top: 1px solid #3c3c3c;
			}

			.properties {
				flex: 1;
			}
		}
		
		.main-panel {
			flex: 10;
			overflow: hidden;
			outline: none !important;
			
			.zoom-panel {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.btn-flat {
			color: white;
		}

		.toolbox {
			position: fixed;
			left: 0;
			bottom: -245px;

			width: calc(100% - 350px);

			min-height: 300px;

			display: flex;
			flex-direction: column;

			transition: .3s;


			&.open {
				bottom: 0;

				.toolbox-title {
					background: hotpink !important;
				}
			}

			.toolbox-title {
				color: white;
				cursor: pointer;
				display: inline-block;
				max-width: 175px;

				align-self: flex-end;

				margin: 10px;

				i {
					transition: .3s;
				}
			}

			.toolbox-content {
				border-top: 1px solid #3c3c3c;
				flex: 100;
				
				width: 100%;

				display: flex;
				flex-direction: row;
				background: var(--background);

				.preset {
					min-width: 250px;
					max-width: 250px;
					display: flex;
					flex-direction: column;
					background-color: #2b2b2b;
					cursor: pointer;

					margin: 10px;
					
					transition: .3s;

					&:hover {
						transform: translateY(-10px);
					}

					.display {
						flex: 10;

						display: flex;
						justify-content: center;
						align-items: center;
					}

					.title {
						flex: 1;
						padding: 15px;
						font-size: 24px;
						text-align: center;
						color: white;

						font-family: Roboto;
						font-weight: 100;
						cursor: pointer;
					}
				}
			}
		}
	}

	html, body {
		margin: 0;
		height: 100%;
	}
</style>