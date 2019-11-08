
const { gen_str, get_current_page } = require("../../util");
const { get_user } = require("../../user.js");

// API new palette
const new_palette_router = async (req, res) => {

	if(!req.user) {
		res.json({
			status: 403,
			msg: "Not signed in"
		})
	}

	if((req.body.name || "").trim().length == 0) {
		res.status(400);
		res.json({
			status: 400,
			err: "Title is not valid"
		});
		return;
	}

	let mail = req.user.mail;
	let palettes = db.collection("palettes");

	let id = gen_str();

	let found_palettes = (req.user || {}).palettes || [];
	
	// Add palette
	await palettes.updateOne({
		id: id
	}, {
		$set: {
			people_allowed: [{ id: req.user.id, write: true }],
			people_allowed_ids: [req.user.id],
			deleted: false,
			visible: true,
			id: id,
			created_at: Date.now(),
			created_by: req.user.id,
			name: req.body.name,
			index: found_palettes.length,
			colors: []
		}
	}, {
		upsert: true
	});

	// Add ID to user
	let users = db.collection("users");

	let to_push = {
		palettes: {
			$each: [id],
			$position: 0
		}
	}

	let to_set = {}
	// if(get_current_page(req) == "dashboard") {
	if(req.body.add_to_dashboard == "1") {
		let user = await get_user(req.user.id);
		let dashboard = user.dashboard || [];
		dashboard.unshift(id);
		to_set["dashboard"] = dashboard;
	}

	let result = {
		$push: to_push
	}

	if(to_set["dashboard"]) result["$set"] = to_set

	await users.updateOne({
		mail: mail
	}, result, {
		upsert: false
	});

	res.json({
		status: 200
	});
}

module.exports = new_palette_router;