import Shape from "./renderers/shape";
import Text from "./renderers/text";
import Texture from "./renderers/texture";
import Ribbon from "./renderers/ribbon";

export default {
	circle: {
		title: "Circle",
		display: {
			type: "raw",
			html: `<div style="border-radius: 50%; padding: 40px; background: white; display: inline-block"></div>`
		},
		create: () => {
			return new Shape();
		}
	},
	text: {
		title: "Text",
		display: {
			type: "raw",
			html: `<div style="font-size: 60px; font-family: serif; color: white; display: inline-block">T</div>`
		},
		create: () => {
			return new Text();
		}
	},
	texture: {
		title: "Texture",
		display: {
			type: "icon",
			icon: "texture"
		},
		create: () => {
			return new Texture();
		}
	},
	ribbon: {
		title: "Ribbon",
		display: {
			type: "icon",
			icon: "bookmarks"
		},
		create: () => {
			return new Ribbon();
		}
	}
};