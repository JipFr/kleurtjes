// Router for adding new members to a palette

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

	if(req.body.member_slug.trim().length <= 0) {
		res.status(400);
		res.json({
			status: 400,
			err: "Invalid slug"
		});
		return;
	}

	let new_member = await get_user(req.body.member_slug.trim());

	if(!new_member) {
		res.status(400);
		res.json({
			status: 400,
			err: "User not found"
		});
		return;
	}

	if(collection.members.find(obj => obj.id === new_member.id)) {
		res.status(400);
		res.json({
			status: 400,
			err: "This user is already in this collection" 
		});
		return;
	}

	let collections = db.collection("collections");

	await collections.updateOne({
		id: collection.id
	},
	{
		$push: {
			members: {
				id: new_member.id,
				role: "member",
				added_at: Date.now()
			}
		}
	}, { upsert: false });

	res.json({
		status: 200
	})
}