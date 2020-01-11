
const { get_palette } = require("../../../util");

module.exports = async (req, res) => {
	let page_collection = require("../../../TMP-collection.json");

	let palettes = await Promise.all(
		page_collection.palettes.map(obj => get_palette(obj.id, (req.user || {}).id))
	);
	palettes = palettes.filter(i => i);

	res.json({
		palettes
	});
}