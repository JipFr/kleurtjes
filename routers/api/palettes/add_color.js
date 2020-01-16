// Add color API router

const { gen_str, get_user_palette_permissions } = require("../../../util");

const add_color_router = async (req, res) => {

	if(!req.user) {
		res.status(403);
		res.json({
			status: 403,
			err: "User not signed in"
		})
	}

	if(req.body.value.trim().length == 0) {
		res.status(400);
		res.json({
			status: 400,
			err: "No value"
		});
		return;
	}

	if(req.body.value.trim().length > 15) {
		res.status(400);
		res.json({
			status: 400,
			err: "Color value too long"
		});
		return;
	}

	let palettes = db.collection("palettes");

	let palette = await palettes.findOne({id: req.body.id});
	let permissions = await get_user_palette_permissions(req.user, palette);
	if(!(palette && permissions.includes("add_color"))) {
		res.status(401);
		res.json({
			status: 401,
			err: "Palette not found or user not allowed"
		});
		return false;
	}

	await palettes.updateOne(
		{id: req.body.id},
		{
			$push: {
				colors: {
					value: req.body.value.trim().slice(0, 20),
					text: req.body.text.replace(/</g, "&lt;").slice(0, 200),
					added_by: req.user.id,
					id: gen_str()
				}
			},
			$set: {
				updated_at: Date.now()
			}
		}
	);

	res.json({
		status: 200
	});

}

module.exports = add_color_router;