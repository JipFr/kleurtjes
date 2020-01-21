
const { get_user } = require("../../util/user");

const me_router = async (req, res) => {
	if(!req.user) {
		res.redirect("/");
		return;
	}
	
	let user = await get_user(req.user.id);
	// res.redirect(`/u/${user.slug}`);
	res.redirect(req.url.replace(/\/me\//, `/u/${user.slug}/`));

}

module.exports = me_router;