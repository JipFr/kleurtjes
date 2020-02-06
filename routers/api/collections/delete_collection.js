
const { get_collection } = require("../../../util");
const { get_user } = require("../../../util/user");

module.exports = async (req, res) => {
	
	if(!req.user) {
		res.status(400);
		res.json({
			status: 400,
			err: "User is not logged in"
		});
		return;
	}

	let collection = await get_collection(req.body.collection);

	if(!collection) {
		res.status(404);
		res.json({
			status: 404,
			err: "Collection not found"
		});
		return;
	}

	await db.collection("collections").updateOne({
		id: collection.id
	}, {
		$set: {
			visible: false,
			deleted: true,
			deleted_at: Date.now()
		}
	}, { upsert: false });

	res.json({
		status: 200,
		url: `/me/collections/`
	});

}