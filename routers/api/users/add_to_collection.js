
const { get_collection, get_palette } = require("../../../util");
const { get_user } = require("../../../util/user");

module.exports = async (req, res) => {

	if(!req.user) {
		res.status(403);
		res.json({
			status: 403,
			err: "User is not signed in"
		});
		return
	}

	let [ collection, palette ] = await Promise.all([
		get_collection(req.body.collection_id),
		get_palette(req.body.palette_id)
	]);

	if(!collection || !palette) {
		res.status(404);
		res.json({
			status: 404,
			err: "Palette or collection not found"
		});
		return;
	}

	if(!collection.members.find(u => u.id === req.user.id && u.role === "admin")) {
		res.status(403);
		res.json({
			status: 403,
			err: "User is not an admin on this collection"
		});
		return;
	}

	if(collection.palettes.find(p => p.id === palette.id)) {
		res.status(400);
		res.json({
			status: 400,
			err: "Palette is already in collection"
		});
		return;
	}

	let new_palettes = [...collection.palettes];

	new_palettes.unshift({
		id: palette.id,
		added_at: Date.now(),
		added_by: req.user.id
	});

	// Also update db entry
	let collections = db.collection("collections");

	await collections.updateOne({
		id: collection.id
	}, {
		$set: {
			palettes: new_palettes
		},
		$push: {
			audit_log: {
				at: Date.now(),
				by: req.user.id,
				event: "palette.added",
				palette: palette.id
			}
		}
	});

	res.json({ 
		status: 200, 
		msg: "Palette was added to " + collection.title 
	});
}