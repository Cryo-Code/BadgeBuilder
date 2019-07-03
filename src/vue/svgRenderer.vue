<script>
import { create } from 'domain';

export default {
	render(createElement) {
		return this.layer.renderer.render(createElement);
	},
	props: ["layer"]
}

</script>