
const { gen_str, get_current_page } = require("../../../util");
const { get_user } = require("../../../util/user");

// API new palette
const new_palette_router = async (req, res) => {

	console.log(123);

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
	
	console.log(req.body);
	let collections = db.collection("collections");
	let existingSlug = await collections.findOne({ slug: req.body.slug });
	if(existingSlug) {
		res.status(400);
		res.json({
			status: 400,
			err: "Slug is taken"
		});
		return;
	}

	let coll_id = gen_str();
	let user = await get_user(req.user.id);

	// Add collection
	await collections.updateOne({ id: coll_id },
	{
		$set: {
			"title": req.body.name,
			"description": req.body.description || "",
			"slug": req.body.slug,
			"deleted": false,
			"visible": true,
			"updated_at": Date.now(),
			"created_at": Date.now(),
			"created_by": user.id,
			"owner": user.id,
			"members": [
				{
					"id": user.id,
					"role": "admin"
				}
			],
			"color": null,
			"palettes": []
		}
	}, {
		upsert: true
	});

	res.json({
		status: 200,
		id: coll_id,
		url: `/c/${req.body.slug}/`
	});

}

module.exports = new_palette_router;