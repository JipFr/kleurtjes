
const { get_palette, get_collection } = require("../../../util");

module.exports = async (req, res) => {
	let page_collection = await get_collection(req.params.slug);

	if(page_collection) {
		let palettes = await Promise.all(
			page_collection.palettes.map(obj => get_palette(obj.id, (req.user || {}).id))
		);
		palettes = palettes.filter(i => i);

		res.json({
			palettes
		});
	} else {
		res.status(404)
		res.json({
			status: 404
		});
	}
}