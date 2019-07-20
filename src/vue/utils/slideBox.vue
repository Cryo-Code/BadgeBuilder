<template>
	<div class="slide-box">
		<div class="slide-container">
			<div class="slide-value" ref="block">
				<slot class="slide-block" :name="type" :data="valueContainer" />
			</div>
			<div class="slide-groups" ref="groups" :style="'right: ' + blocks.right + 'px; top: ' + blocks.top + 'px;'">
				<div class="slide-group" v-for="(group, key) in data" :key="key">
					<div class="slide-block-wrap">
						<slot v-if="!group.hideGroupSlot" class="slide-block" :name="key" :data="{value: group.default, meta: group.meta || {}}"/>
						<h4 v-if="!group.hideGroupName">{{key}}</h4>
					</div>
					<div class="slide-down" :style="group.canOverflow ? 'overflow: visible' : ''">
						<input type="text" placeholder="Search" v-model="search[key]" />
						<div class="slide-block-wrap" :style="group.canOverflow ? 'overflow: visible' : ''" @mousedown="!block.custom ? select(key, block.value) : type = key" :class="{'custom-block': block.custom}" v-for="block in searchData[key]" :key="block.name">
							<slot v-if="!block.custom" :name="key" class="slide-block" :data="{value: block.value, meta: block.meta || {}}" />
							<slot v-else :name="block.slot" class="slide-block" :data="valueContainer" />

							<h4 v-if="!block.custom && !group.hideName">{{block.name}}</h4>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ["value", "data"],
		data: () => {
			return {
				editing: false,
				type: "",
				valueContainer: {value: "", meta: {}},
				search: {},
				blocks: {
					right: 0,
					top: 0
				},
				update: null
			}
		},
		watch: {
			value(nv) {
				this.valueContainer.value = nv.value;
				this.valueContainer.meta = nv.meta;
				this.type = nv.type;
			},
			data(d) {
				for (let k in d) {
					this.search[k] = "";
				}
			},
			valueContainer: {
				handler(v) {
					this.updateValue(v.value);
				},
				deep: true
			}
		},
		computed: {
			searchData() {
				let filteredData = {};

				for (let k in this.data) {
					let max = 25;

					let search = (this.search[k] || "").toLowerCase();

					if (!filteredData[k])
						filteredData[k] = [];

					for (let d of this.data[k].data) {
						if (d.name.toLowerCase().includes(search) && max > 0) {
							max--;
							filteredData[k].push(d);
						}
					}
				}

				return filteredData;
			}
		},
		model: {
			prop: "value",
			event: "input"
		},
		methods: {
			select(type, value) {
				this.type = type;
				this.updateValue(value);
			},
			updateValue(v) {
				this.valueContainer.value = v;
				this.$emit("input", Object.assign(this.value, {value: v, type: this.type}));
			}
		},
		created() {
			this.valueContainer.value = this.value.value;
			this.type = this.value.type;
		},
		mounted() {
			this.update = () => {
				let rect = this.$refs.block.getBoundingClientRect();

				this.blocks.right = window.innerWidth - rect.left;
				this.blocks.top = rect.top - 10;
			};

			window.addEventListener("resize", this.update);
			document.addEventListener("scroll", this.update, true);

			this.update();
		},
		destroyed() {
			document.removeEventListener("scroll", this.update);
			window.removeEventListener("resize", this.update);
		}
	};
</script>

<style lang="less">

	.slide-box:hover {
		z-index: 1000;

		.slide-groups, .slide-container {
			z-index: 10000;
		}

		.slide-container {
			background: #303030;
		}

		.slide-groups {
			opacity: 1;
			pointer-events: all;
		}
	}

	.slide-value, .slide-block-wrap {
		min-height: 50px;
		cursor: pointer;
		border-radius: 6px;
		overflow: hidden;
		padding: 5px;
		
		transition: .3s;

		min-width: 295px;

		position: relative;

		h4 {
			font-family: Roboto;
			font-weight: 100;
			
			position: absolute;
			bottom: 0;
			padding-left: 10px;
			color: white;
			text-shadow:
				-1px -1px 0 #000,  
				1px -1px 0 #000,
				-1px 1px 0 #000,
				1px 1px 0 #000;
		}

		&:not(.custom-block):hover {
			background: rgba(255, 255, 255, 0.5);
		}
	}

	.slide-container {
		display: flex;
		flex-direction: row-reverse;

		background: transparent;
		margin-left: -16px;

		border-radius: 6px;

		> .slide-value {
			margin: 10px;
		}
	}

	.slide-groups {
		position: absolute;

		display: flex;
		flex-direction: row;

		height: 150px;

		right: 320px;

		opacity: 0;
		pointer-events: none;

		transition: .3s;

		background: #303030;

		border-radius: 6px;


		.slide-group {
			margin-right: 10px;

			
			> .slide-block-wrap {
				margin-top: 10px;
				margin-left: 10px;
			}
		

			&:hover .slide-down {
				opacity: 1;
				pointer-events: all;
			}
		}
	}

	.slide-down {
		position: absolute;
		z-index: 100;

		padding: 10px;

		opacity: 0;
		pointer-events: none;

		transition: .3s;

		background: #303030;

		border-bottom-left-radius: 6px;
		border-bottom-right-radius: 6px;

		width: 315px;

		max-height: 500px;
		overflow-y: auto;

		&::-webkit-scrollbar {
			width: 0px;
			background: transparent;
		}

		.slide-block-wrap {
			margin-top: 10px;

			min-width: 275px;
		}

		input {
			color: white;
		}
	}

	.slide-block {
		height: 120px;
	}
</style>

<!--
<slide-box :data="{'color': {default: '#FF0000', data: [{name: 'custom', slot: "editor", custom: true}]}}">
	<div v-slot:editor v-slot:default="slotProps">
		<color :value="slotProps.value" />
	</div>

	<div v-slot:default="slotProps" :style="'background: slotProps.value'">
		
	</div>
</slide-box>
-->