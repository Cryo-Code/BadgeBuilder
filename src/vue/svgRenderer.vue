<script>

export default {
	render(createElement) {
		return this.layer.renderer.render(createElement);
	},
	props: ["layer"]
}

</script>