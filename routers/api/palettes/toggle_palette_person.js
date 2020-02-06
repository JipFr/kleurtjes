
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

	let person_to_toggle = await users.findOne({slug: req.body.username });
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
			err: "You can't remove yourself from your own palette"
		});
		return;
	}

	palette.people_allowed = palette.people_allowed.map(i => typeof i == "string" ? { id: i } : i);

	if(!req.body.add && palette.people_allowed.find(i => i.id == person_to_toggle.id)) {
		while(palette.people_allowed.find(i => i.id == person_to_toggle.id)) {
			palette.people_allowed.splice(palette.people_allowed.indexOf(palette.people_allowed.find(i => i.id == person_to_toggle.id)), 1);
		}
	} else if(req.body.add && !palette.people_allowed.find(i => i.id == person_to_toggle.id)) {
		palette.people_allowed.push({
			id: person_to_toggle.id,
			write: false
		});
	}

	await palettes.updateOne({
		id: req.body.palette_id
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