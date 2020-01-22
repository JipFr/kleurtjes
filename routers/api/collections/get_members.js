
// Get users in a collection

const { get_collection } = require("../../../util");
const { get_user } = require("../../../util/user");

module.exports = async (req, res) => {

	if(!req.body.collection_slug || req.body.collection_slug.trim().length <= 0) {
		res.status(400);
		res.json({
			status: 400,
			err: "Missing or invalid collection"
		});
		return;
	}

	const collection = await get_collection(req.body.collection_slug);

	if(!collection) {
		res.status(400);
		res.json({
			status: 400,
			err: "Collection not found"
		});
		return;
	}

	let members = collection.members.map(member => {

		if(member.id === collection.owner) member.is_owner = true;

		return member;
	});

	res.json({
		status: 200,
		members
	});

}