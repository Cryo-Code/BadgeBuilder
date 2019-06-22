const path = require("path");
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
	entry: "./index.js",
	mode: "development",
	watch: true,
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist")
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: "vue-loader"
			},
			{
				test: /\.less$/,
				use: [
					"vue-style-loader",
					"css-loader",
					"less-loader"
				]
			}
		]
	},
	plugins: [
		new VueLoaderPlugin()
	]
};