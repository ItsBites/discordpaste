const router = module.exports = express.Router(); // eslint-disable-line new-cap

router.get("/", async (req, res) => {
	res.status(200).send(await app.page(req, "index")).end();
});
