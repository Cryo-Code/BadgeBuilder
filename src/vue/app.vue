<template>
	<div class="app">
		<div class="main-panel">

		</div>
		<div class="right-panel">
			<properties class="properties" :workspace="workspace"/>
			<layers class="layers" :workspace="workspace"/>
		</div>
	</div>
</template>

<script>
import layers from "./layers.vue";

export default {
	data: () => {
		return {
			theme: "dark",
			workspace: {
				layers: [],
				selectedLayer: null
			}
		};
	},
	components: {
		layers
	}
}
</script>


<style lang="less">
	:root {
		--background: rgb(32, 32, 32);
	}

	.app {
		display: flex;

		height: 100%;
		width: 100%;

		background: var(--background);

		.right-panel {
			flex: 2;

			min-width: 350px;

			display: flex;
			flex-direction: column;

			.layers {
				flex: 2;
			}

			.properties {
				flex: 1;
			}
		}
		
		.main-panel {
			flex: 10;
		}
	}

	html, body {
		margin: 0;
		height: 100%;
	}
</style>