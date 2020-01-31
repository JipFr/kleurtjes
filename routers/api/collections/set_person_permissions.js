
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

	let user = await get_user(req.user.id);
	let collection = await get_collection(req.body.collection);
	
	if(!collection) {
		res.status(400);
		res.json({
			status: 400,
			err: "Collection not found"
		});
		return;
	}

	for(let member of collection.members) {
		let user = await get_user(member.id);
		if(user.slug === req.body.username) member.role = req.body.new_role;
	}

	let collections = db.collection("collections");
	await collections.updateOne({
		slug: req.body.collection
	}, {
		$set: {
			members: collection.members
		}
	});

	let members = collection.members.map(member => {

		if(member.id === collection.owner) member.is_owner = true;

		return member;
	});

	res.json({
		status: 200,
		members
	});
}