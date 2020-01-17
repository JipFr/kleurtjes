
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

	let new_title = req.body.new_title.trim();
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

	if(collection.title.trim() == new_title) {
		res.status(400);
		res.json({
			status: 400,
			err: "This is already the collection's current title" 
		});
		return;
	}

	if(new_title.length <= 0) {
		res.status(400);
		res.json({
			status: 400,
			err: "Invalid title"
		});
		return;
	}

	let collections = db.collection("collections");

	await collections.updateOne({
		id: collection.id
	},
	{
		$set: {
			title: new_title
		}
	}, { upsert: false });

	res.json({
		status: 200
	})
}