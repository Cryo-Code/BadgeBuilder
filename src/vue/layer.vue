<template>
	<div class="layer" :data-layer-id="layer.id" @click="select" @mouseenter="$emit('mouseenter', $event)" @mouseleave="$emit('mouseleave', $event)" :class="{selected}">
		<editable-label class="name" v-model="layer.name"/>
	</div>
</template>

<script>
	import editableLabel from "./utils/editableLabel.vue";
	import interact from 'interactjs';

	export default {
		props: ["workspace", "layer", "i"],
		components: {
			editableLabel
		},
		methods: {
			select(e) {
				if (e.ctrlKey) {
					if (this.selected) {
						this.workspace.selection.splice(this.workspace.selection.indexOf(this.layer), 1);
					}else{
						this.workspace.selection.push(this.layer);
					}
				}else{
					if (this.workspace.selection.length > 0 && e.shiftKey) {
						let selection = this.workspace.selection[0];
						
						let dir = 1;

						if (this.workspace.layers.indexOf(this.layer) < this.workspace.layers.indexOf(selection))
							dir = -1;

						for (let i = this.workspace.layers.indexOf(this.workspace.selection[0]); dir == 1 ? i <= this.workspace.layers.indexOf(this.layer) : i >= this.workspace.layers.indexOf(this.layer); i += dir)
							if (i < this.workspace.layers.length && !this.workspace.selection.includes(this.workspace.layers[i]))
								this.workspace.selection.push(this.workspace.layers[i]);
					}else{
						if (this.workspace.selection.length == 1 && this.workspace.selection[0].id == this.layer.id)
							return;

						this.workspace.selection.splice(0, this.workspace.selection.length);
						this.workspace.selection.push(this.layer);
					}
				}
			}
		},
		computed: {
			selected() {
				return this.workspace.selection.includes(this.layer);
			}
		},
		mounted: function () {
			let that = this;

			let offset = 0;

			interact(this.$el).draggable({
				onmove(event) {
					let target = event.target;
					
					let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

					//target.style.position = 'absolute';
					//target.style.top = (event.clientY - that.$el.parentElement.getBoundingClientRect().y) - offset + "px";
					
					target.setAttribute('data-y', y);
					target.setAttribute('data-i', that.i);

					let moveTo = 0;

					moveTo = -((target.parentElement.getBoundingClientRect().y + that.i * 75) - (event.clientY - offset));
					
					event.target.style.transform = "translateY(" + moveTo + "px)";

					let pos = target.getBoundingClientRect().y - that.$el.parentElement.getBoundingClientRect().y;

					that.$emit("list-move", pos);
				},
				onstart(event) {
					event.target.classList.add("moving");
					offset = event.clientY - event.target.getBoundingClientRect().y;
				},
				onend(event) {
					event.target.style.transform = "translateY(0px)";
					event.target.setAttribute("data-y", 0);
					event.target.classList.remove("moving");
				}
			})
		}
	}
</script>


<style lang="less">
	.layer {
		padding-left: 10px;
		min-height: 75px;
		background: #2b2b2b;
		padding-top: 8px;
		width: 100%;
		

		border-left: 5px solid #2b2b2b;

		.name .label, .name .input {
			font-size: 16px;
			font-family: Roboto;
		}

		&.selected {
			border-left: 5px solid dodgerblue;
		}
	}
</style>