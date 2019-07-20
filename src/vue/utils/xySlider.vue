<template>
	<div class="xy-slider row">
		<div class="col s10">
			<label>{{labels.x}}</label>
			<input type="number" v-model.number="vValue.x"/>
			<input type="range" :min="min || 0" :max="max || 1024" v-model.number="vValue.x" />

			<label>{{labels.y}}</label>
			<input type="number" v-model.number="vValue.y"/>
			<input type="range" :min="min || 0" :max="max || 1024" v-model.number="vValue.y" />
		</div>
		<div class="col s2" style="display: flex; align-items: center; padding: 0; height: 126px;">
			<div class="waves-effect waves-teal btn-flat" @click="vValue.linked = !vValue.linked">
				<i style="color: white;" v-if="vValue.linked" class="material-icons">
					link
				</i>
				<i style="color: white;" v-else class="material-icons">
					link_off
				</i>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {"value": {}, min: {}, max: {}, labels: {default: () => {return {x: "Width", y: "Height"};}}},
		data: () => {return {editing: false, vValue: {x: 0, y: 0, linked: true}}},
		watch: {
			value: function (nv) {
				this.vValue.x = nv.x;
				this.vValue.y = nv.y;
				this.vValue.linked = nv.linked;
			},
			"vValue.x": function (x) {
				if (this.vValue.linked)
					this.vValue.y = x;
				
				this.updateValue();
			},
			"vValue.y": function (y) {
				if (this.vValue.linked)
					this.vValue.x = y;

				this.updateValue();
			}
		},
		model: {
			prop: "value",
			event: "input"
		},
		methods: {
			updateValue() {
				this.$emit("input", this.vValue);
			}
		},
		mounted: function () {
			document.addEventListener("click", this.deactivate);

			this.vValue.x = this.value.x;
			this.vValue.y = this.value.y;

			if (!("linked" in this.value))
				this.value.linked = true;

			this.vValue.linked = this.value.linked;
		},
		beforeDestroy: function () {
			document.removeEventListener("click", this.deactivate);
		}
	};
</script>

<style lang="less">
	
</style>