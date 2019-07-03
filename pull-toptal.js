const request = require("request");
const cheerio = require("cheerio");

let pages = 21;

let getPatterns = async (url) => {
	let prom = new Promise((resolve, reject) => {
		request(url, (error, req, body) => {
			let $ = cheerio.load(body);

			let patterns = [];

			let posts = $(".loop.post");
			posts.each(function (i, e) {
				let name = $(this).find(".entry-title").text().trim();
				
				let url = /background-image: url\('(.*)'\)/g.exec($(this).find(".patternpreview").attr("style"));
				if (url && url.length > 1) {
					url = url[1];
				}else{
					url = /background-image: url\((.*)\)/g.exec($(this).find(".patternpreview").attr("style"))[1];
				}

				if (!url.includes("https://www.toptal.com")) {
					url = "https://www.toptal.com" + url;
				}

				console.log(url);

				patterns.push({name: name, value: url});
			});

			resolve(patterns);
		});
	});

	return await prom;
};

(async () => {
	let pats = [];
	for (let i = 0; i < pages; i++) {
		console.log(i);
		pats = pats.concat(await getPatterns("https://www.toptal.com/designers/subtlepatterns/thumbnail-view/page/" + i));
	}
	console.log(JSON.stringify(pats));
})();