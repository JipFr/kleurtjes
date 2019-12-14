
const { get_user } = require("../../user");
const { get_bio } = require("../../util");

// Set new user's color router
module.exports = async (req, res) => {

	if(!req.user) {
		res.status(403);
		res.json({
			status: 403,
			err: "User is not signed in"
		});
		return;
	}

	// Just to be sure
	let user = await get_user(req.user.id);
	let new_bio = get_bio(req.body.bio);

	if(new_bio == user.bio) {
		res.status(403);
		res.json({
			status: 403,
			err: "New description value is the same as the current one"
		});
		return;
	}

	// NOW update it
	await db.collection("users").updateOne({
		id: req.user.id
	}, {
		$set: {
			bio: new_bio
		},
		$push: {
			bio_history: {
				from: user.bio,
				to: new_bio,
				at: Date.now()
			}
		}
	});

	res.json({
		status: 200
	});
}