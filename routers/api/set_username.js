
const { get_user } = require("../../util/user");

// Set new username router
module.exports = async (req, res) => {

	if(!req.user) {
		res.status(403);
		res.json({
			status: 403,
			err: "User is not signed in"
		});
		return;
	}

	let user = await get_user(req.user.id);

	let new_username = req.body.new_name.trim().toLowerCase().split("").filter(i => "abcdefghijklmnopqrstuvwxyz0987654321 ".includes(i)).join("").replace(/ /g, "_");
	let current_username = user.slug.toLowerCase();

	if(new_username === current_username) {
		res.json({
			status: 200,
			msg: "Same name"
		});
		return;
	}
	if(new_username.trim().length < 3) {
		res.json({
			status: 403,
			err: "Username too short"
		});
		return;
	} else if(new_username.trim().length >= 20) {
		res.json({
			status: 403,
			err: "Username too long"
		});
		return;
	}

	let verify_user = await get_user(new_username);
	if(verify_user) {
		res.status(403);
		res.json({
			status: 403,
			err: "Username is taken"
		});
		return;
	}

	// NOW update it
	await db.collection("users").updateOne({
		id: req.user.id
	}, {
		$set: {
			slug: new_username
		},
		$push: {
			username_changes: {
				from: current_username,
				to: new_username,
				at: Date.now()
			}
		}
	});

	res.json({
		status: 200
	});
}