const { get_user_palette_permissions } = require("../../../util");
const { get_user } = require("../../../util/user");

// Change palette title router
const change_palette_title = async (req, res) => {

	let palettes = db.collection("palettes");

	let palette = await palettes.findOne({ id: req.body.palette_id });
	palette.permissions = await get_user_palette_permissions(req.user, palette);
	
	if(!(palette && (palette.permissions.includes("change_title") || palette.permissions.includes("*")))) {
		res.status(403);
		res.json({
			status: 403,
			err: "You don't have the rights neccesary for this"
		});
		return;
	}

	let new_title = req.body.new_title;

	await palettes.updateOne(
		{ id: palette.id },
		{ 
			$set: { 
				name: new_title
			},
			$push: {
				name_history: {
					from: palette.title,
					to: new_title,
					at: Date.now()
				}
			}
		}
	);

	

	res.json({
		status: 200
	});

}

module.exports = change_palette_title;