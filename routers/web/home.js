
const { get_user } = require("../../util/user");

// Home page router
const home_router = async (req, res) => {
	let user = await get_user((req.user || {}).id);
	res.redirect(req.user ? `/u/${(user || {}).slug}/` : "/log-in/");
}

module.exports = home_router;