
const { get_user } = require("../../user");

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

	let user = await get_user(req.user.id);
	let new_color = req.body.color;

	if(!(/^#[0-9A-F]{6}$/i.test(new_color))) {
		res.json({
			status: 403,
			err: "Invalid color"
		});
		return;
	}

	// NOW update it
	await db.collection("users").updateOne({
		id: req.user.id
	}, {
		$set: {
			color: new_color
		},
		$push: {
			color_history: {
				from: user.color,
				to: new_color,
				at: Date.now()
			}
		}
	});

	res.json({
		status: 200
	});
}