<template>
	<div class="properties" :class="{overflow: overflow}">
		<template v-if="selection.length > 0">
			<div class="prop-row row" v-for="(v, k) in props" :key="k" :style="'margin-top: ' + (v.data.required ? '0px' : '20px')">
				<div class="col s1" v-if="!v.data.required">
					<label>
						<input indeterminate="true" type="checkbox" class="filled-in" @input="setActive(k, v.active == 1 ? false : true)" :checked="v.active == 1 ? 'checked' : null" />
						<span></span>
					</label>
				</div>
				<div class="col" :class="{'s11': !v.data.required, 's12': v.data.required, 'disabled': v.data.active == 0}">
					<component :is="v.value.value.render()" :self="v.value.value"></component>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
	export default {
		props: ["workspace", "selection"],
		components: {
			
		},
		data: () => {
			return {props: {}, overflow: false};
		},
		watch: {
			selection() {
				this.updateProxy();
			}
		},
		methods: {
			updateProxy() {
				let props = {};

				for (let layer of this.selection) {
					for (let k in layer.data) {
						props[k] = props[k] || {
							active: layer.data[k].active ? 1 : 0,
							data: layer.data[k],
							value: {mixed: false, value: layer.data[k].value}
						};
						console.log(k, props[k].active);

						if (props[k].active != layer.data[k].active ? 1 : 0)
							props[k].active = 2;
						
						if (!props[k].value.mixed && !props[k].value.value.compare(layer.data[k].value))
							props[k].value.mixed = true;
					}
				}

				this.props = props;
			},
			setActive(k, to) {
				for (let layer of this.selection) {
					layer.data[k].active = to;
				}

				this.updateProxy();
			}
		},
		mounted() {
			return;
			
			this.$el.addEventListener("mouseenter", (e) => {
				if (e.target.closest(".slide-box")) {
					this.$el.scrollTop = 
					this.overflow = true;
				}
			}, true);

			this.$el.addEventListener("mousemove", (e) => {
				if (!e.target.closest(".slide-box")) {
					this.overflow = false;
				}
			}, true);
		}
	}
</script>


<style lang="less">

	.properties {
		overflow: auto;

		&.overflow {
			overflow: visible;

			padding-right: 10px;
		}
	}

	.prop-row {
		.col {
			transition: .3s;
		}

		.col.disabled {
			opacity: .3;
			user-select: none;
			pointer-events: none;
		}
	}
</style>