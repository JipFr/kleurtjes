
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

	let new_bio = req.body.new_bio.trim();
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

	if(collection.description.trim() === new_bio) {
		res.status(400);
		res.json({
			status: 400,
			err: "This is already the collection's current description" 
		});
		return;
	}

	if(new_bio.length <= 0) {
		res.status(400);
		res.json({
			status: 400,
			err: "Invalid bio"
		});
		return;
	}

	let collections = db.collection("collections");

	await collections.updateOne({
		id: collection.id
	},
	{
		$set: {
			description: new_bio.slice(0, 200)
		}
	}, { upsert: false });

	res.json({
		status: 200
	})
}