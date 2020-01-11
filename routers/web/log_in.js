
const { universal_handlebar } = require("../../config.json");
const { get_user } = require("../../util/user");

// Log in router
const log_in_router = async (req, res) => {
	
	let user = await get_user((req.user || {}).id);

	res.render("login", {
		layout: "main",
		universal: universal_handlebar,
		head_title: "Log in",
		user
	});
}

module.exports = log_in_router;