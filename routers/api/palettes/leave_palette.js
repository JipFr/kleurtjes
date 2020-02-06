
const { get_user_palette_permissions } = require("../../../util");

// "Leave palette" removes a user from the palette in question
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

	let person_to_toggle = user.id;
	let palette = await palettes.findOne({ id: req.query.id, visible: true });

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

	if(!palette.people_allowed.find(i => i.id === person_to_toggle)) {
		res.status(403);
		res.json({
			status: 403,
			err: "You are not a member of this palette"
		});
		return;
	}

	palette.people_allowed = palette.people_allowed.map(i => typeof i == "string" ? { id: i } : i); // Make sure every type is solid, as some old palettes might not have this

	// Actually remove the user
	palette.people_allowed = palette.people_allowed.filter(i => i.id !== person_to_toggle);

	await palettes.updateOne({
		id: palette.id
	}, {
		$set: {
			people_allowed: palette.people_allowed,
			updated_at: Date.now()
		}
	});

	res.json({
		status: 200
	});
}