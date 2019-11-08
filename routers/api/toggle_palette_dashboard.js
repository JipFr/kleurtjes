module.exports = async (req, res) => {

	if(!req.user) {
		res.json({
			status: 403,
			err: "User not signed in"
		});
	}	

	const users = db.collection("users");

	let user_id = req.user.id;
	let user = await users.findOne({id: user_id});

	let dashboard_ids = user.dashboard || [];

	let toggle_id = req.query.id;

	if(dashboard_ids.includes(toggle_id)) {
		while(dashboard_ids.includes(toggle_id)) {
			dashboard_ids.splice(dashboard_ids.indexOf(toggle_id), 1);
		}	
	} else {
		dashboard_ids.unshift(toggle_id);
	}

	await users.updateOne(
		{
			id: user_id	
		},
		{
			$set: {
				dashboard: dashboard_ids
			}
		},
		{
			upsert: false
		}
	)

	res.json({
		status: 200
	});
}