<template>
	<div>
		<svg :class="background" width="512" height="512" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
			<svg-renderer v-for="(layer) in layers" :key="layer.id" :layer="layer"/>
		</svg>
	</div>
</template>

<script>
	import svgRenderer from "./svgRenderer.vue";

	export default {
		props: ["workspace", "layers", "background"],
		components: {
			svgRenderer
		}
	}
</script>


<style lang="less">
	
</style>