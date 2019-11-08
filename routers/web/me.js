
const { get_user } = require("../../user.js");

const me_router = async (req, res) => {
	if(!req.user) {
		res.redirect("/");
		return;
	}
	
	let user = await get_user(req.user.id);
	res.redirect(`/u/${user.slug}`)

}

module.exports = me_router;