
const { get_user_palette_permissions } = require("../../../util");

// Toggle person from people allowed to palette
module.exports = async (req, res) => {

	if(!req.user) {
		res.json({
			status: 403,
			err: "User not signed in"
		});
	}	

	const users = db.collection("users");
	const palettes = db.collection("palettes");

	let user_id = req.user.id;
	let user = await users.findOne({id: user_id});

	let person_to_toggle = await users.findOne({slug: req.body.username.toLowerCase() });
	let palette = await palettes.findOne({ id: req.body.palette_id, visible: true });

	if(!person_to_toggle) {
		res.status(404);
		res.json({
			status: 404,
			err: "User not found"
		});
		return;
	}
	if(!palette) {
		res.status(404);
		res.json({
			status: 404,
			err: "Palette not found"
		});
		return;
	}

	let permissions = await get_user_palette_permissions(user, palette);

	if(!permissions.includes("manage_people")) {
		res.status(403);
		res.json({
			status: 403,
			err: "You don't own this palette"
		});
		return;
	}
	if(person_to_toggle.id == req.user.id) {
		res.status(403);
		res.json({
			status: 403,
			err: "You can't toggle your own write access"
		});
		return;
	}

	palette.people_allowed = palette.people_allowed.map(i => typeof i == "string" ? { id: i } : i);

	palette.people_allowed = palette.people_allowed.map(i => {
		if(i.id == person_to_toggle.id) {
			i.write = !i.write;
		}
		return i;
	});

	await palettes.updateOne({
		id: req.body.palette_id
	}, {
		$set: {
			people_allowed: palette.people_allowed
		}
	});

	res.json({
		status: 200
	});
}