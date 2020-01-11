
const { get_user_palette_permissions } = require("../../../util");

// Delete color from palette
module.exports = async (req, res) => {

	if(!req.user) {
		res.status(403);
		res.json({
			status: 403,
			err: "User is not signed in"
		});
		return;
	}

	let { palette_id, color } = req.body;

	let palettes = db.collection("palettes");
	let palette = await palettes.findOne({id: palette_id});
	let colors = palette.colors;

	let permissions = await get_user_palette_permissions(req.user, palette);
	
	if(!permissions.includes("delete_color")) {
		res.status(403);
		res.json({
			status: 403,
			err: "Not allowed"
		});
		return;
	}

	let n_colors = colors.filter(i => i.id !== color);

	await palettes.updateOne({
		id: palette_id
	}, {
		$set: {
			colors: n_colors
		}
	});

	res.json({
		status: 200
	});
}