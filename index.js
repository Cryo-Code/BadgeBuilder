import Vue from "vue";
import App from "./src/vue/app.vue";

let app = new Vue({
	el: "#app",
	render: h => h(App)
});