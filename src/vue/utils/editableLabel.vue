<template>
	<div class="editable-label" :class="{'editing': editing}">
		<label class="label" @dblclick="activate()">{{vValue}}</label>
		<input class="input browser-default" @keydown.enter="deactivate()" type="text" ref="input" :value="vValue" @input="updateValue()">
	</div>
</template>

<script>
	export default {
		props: ["value"],
		data: () => {return {editing: false, vValue: ""}},
		watch: {
			value: function (nv) {
				this.vValue = nv;
			}
		},
		model: {
			prop: "value",
			event: "input"
		},
		methods: {
			updateValue() {
				this.vValue = this.$refs.input.value;
				this.$emit("input", this.$refs.input.value);
			},
			activate() {
				this.editing = true;
				this.$refs.input.focus();
				setTimeout(() => {
					this.$refs.input.select();
				});
			},
			deactivate(e) {
				if (!e || !e.target.closest(".editable-label")) {
					this.updateValue();

					this.editing = false;
					this.$refs.input.blur();
				}
			}
		},
		mounted: function () {
			document.addEventListener("click", this.deactivate);

			this.vValue = this.value;
		},
		beforeDestroy: function () {
			document.removeEventListener("click", this.deactivate);
		}
	};
</script>

<style lang="less">
	.editable-label {
		display: inline-block;

		user-select: none;

		.label {
			display: block;
		}
		
		.input {
			display: none;

			border: none;
			background: none;
			color: #9e9e9e;
		}

		&.editing {
			.label {
				display: none;
			}

			.input {
				display: block;
			}
		}
	}
</style>