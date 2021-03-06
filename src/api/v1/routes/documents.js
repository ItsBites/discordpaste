const router = module.exports = express.Router(); // eslint-disable-line new-cap
const shortid = require("shortid");
const { classify } = require(`${__dirname}/../../../misc/classify.js`);
const validLang = require(`${__dirname}/../../../misc/validLang.js`);

// POST /documents (create document)
router.post("/", app.ratelimit(1, 2.5), async (req, res) => {
	let content = req.body.content;

	if(!content) {
		res.status(400).json({ message: "No content" }).end();
	} else if(content.length >= 250000) {
		res.status(400).json({ message: "Content over 100,000 characters" }).end();
	} else {
		let id = shortid.generate();

		let lang = req.body.language, fulllang;
		if(lang) ({ extension: lang, codemirror: fulllang } = validLang(lang));
		if(!lang) lang = fulllang = classify(content);

		let insertion = { id, content, possibleLanguage: lang };
		console.log(`New paste (${id}) - Language: ${lang} (${fulllang})`);
		await r.table("documents").insert(insertion).run();
		res.status(201).json(insertion).end();
	}
});

// GET /documents/id (get document)
router.get("/:id", app.ratelimit(5, 5), async (req, res) => {
	let id = req.params.id;
	let document = await r.table("documents").get(id).run();
	if(document) {
		res.status(200).json(document).end();
	} else {
		res.status(404).json({ message: "Document not found" }).end();
	}
});
