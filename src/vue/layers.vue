<template>
	<div class="layers">
		<layer v-for="v in workspace.layers" :workspace="workspace" :key="v.id" :layer="v"/>
	</div>
</template>

<script>
import layer from "./layer.vue";

export default {
	props: ["workspace"],
	components: {
		layer
	}
}
</script>


<style lang="less">
	.layer {

	}
</style>