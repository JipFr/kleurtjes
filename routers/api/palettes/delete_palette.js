const { get_user_palette_permissions } = require("../../../util");
const { get_user } = require("../../../util/user");

// Delete palette router
const delete_palette_router = async (req, res) => {

	let palettes = db.collection("palettes");

	let palette = await palettes.findOne({ id: req.body.id });
	palette.permissions = await get_user_palette_permissions(req.user, palette);
	
	if(!(palette && (palette.permissions.includes("delete_palette") || palette.permissions.includes("*")))) {
		console.log(palette)
		res.status(403);
		res.json({
			status: 403,
			err: "You are not the creator of this palette"
		});
		return;
	}

	await palettes.updateOne(
		{ id: req.body.id },
		{ 
			$set: { 
				deleted: { 
					is_deleted: true, 
					deleted_at: Date.now() 
				},
				visible: false
			}
		}
	);

	let user = await get_user(req.user.id);
	for(let palette_id of user.palettes) {

	}	
	let n_palettes = await Promise.all(user.palettes.map(id => palettes.findOne({ id, visible: true })));
	
	let exists = id => {
		return n_palettes.find(palette => (palette || {}).id == id) ? true : false;
	}

	let palette_arr = user.palettes.filter(exists);
	let dashboard_arr = user.dashboard.filter(exists);
	
	let users = db.collection("users");
	await users.updateOne({
		id: user.id
	}, {
		$set: {
			palettes: palette_arr,
			dashboard: dashboard_arr
		}
	});

	res.json({
		status: 200
	});

}

module.exports = delete_palette_router;