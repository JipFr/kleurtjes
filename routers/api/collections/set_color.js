
const { get_collection } = require("../../../util");
const { get_user } = require("../../../util/user");

module.exports = async (req, res) => {

	if(!req.user) {
		res.status(401);
		res.json({
			status: 401,
			err: "User is not signed in" 
		});
		return;
	}

	let new_color = req.body.new_color.trim();
	let collection = await get_collection(req.body.collection);
	let user = await get_user(req.user.id);

	if(user.id !== (collection.created_by || collection.owner)) {
		res.status(401);
		res.json({
			status: 401,
			err: "User is not the owner"
		});
		return;
	}

	if((collection.color || "").trim() == new_color) {
		res.status(400);
		res.json({
			status: 400,
			err: "This is already the collection's current theme color" 
		});
		return;
	}

	if(new_color.length <= 0) {
		res.status(400);
		res.json({
			status: 400,
			err: "Invalid color"
		});
		return;
	}

	let collections = db.collection("collections");

	await collections.updateOne({
		id: collection.id
	},
	{
		$set: {
			color: new_color
		},
		$push: {
			audit_log: {
				at: Date.now(),
				by: req.user.id,
				event: "setting.color_set",
				from: collection.color,
				to: new_color 
			}
		}
	}, { upsert: false });

	res.json({
		status: 200
	})
}