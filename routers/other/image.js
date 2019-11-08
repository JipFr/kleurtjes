// USER image router
const image_router = async (req, res, next) => {

	let users = db.collection("users");

	let uid = req.params.user;
	let user = await users.findOne({id: uid});
	if(!user) user = await users.findOne({slug: uid});

	if(!user) {
		next();
		return;
	}

	res.redirect(user.user.photos[0].value);
}

module.exports = image_router;