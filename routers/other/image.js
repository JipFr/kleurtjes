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

	let photo_url = user.user.photos[0].value;
	photo_url = photo_url.replace(/=s96/g, "=s24")

	res.redirect(photo_url);
}

module.exports = image_router;