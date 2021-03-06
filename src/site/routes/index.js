const router = module.exports = express.Router(); // eslint-disable-line new-cap
const superagent = require("superagent");
const validLang = require(`${__dirname}/../../misc/validLang.js`);

const languages = require(`${__dirname}/../../misc/languageMap.json`);
const modeList = Object.keys(languages)
	.filter(key => languages[key].codemirrorMode && languages[key].extensions)
	.map(key => ({
		extension: languages[key].extensions[0].substring(1),
		cmm: languages[key].codemirrorMode,
		name: key
	}));

router.get("/", async (req, res) => {
	res.status(200).send(await app.page(req, "index", { post: true, lang: "text", modeList })).end();
});

router.get("/:id", async (req, res) => {
	let id = req.params.id, lang;
	if(~id.indexOf(".")) {
		lang = id.substring(id.indexOf(".") + 1).toLowerCase();
		id = id.substring(0, id.indexOf("."));
		lang = validLang(lang);
		if(lang) lang = lang.codemirror;
	}

	try {
		let { body: { content } } = await superagent.get(`${app.config.baseURL}/api/v1/documents/${id}`);
		res.status(200).page("index", { view: true, content, lang, id, modeList }).end();
	} catch(err) {
		res.redirect(app.config.baseURL);
	}
});
