
const { universal_handlebar } = require("../../config.json");
const { get_user } = require("../../user");

// Settings main router
module.exports = async (req, res) => {

	if(!req.user) {
		res.redirect("/");
		return;
	}

	let user = await get_user(req.user.id);

	res.render("settings", {
		layout: "main",
		universal: universal_handlebar,
		user,
		page: { user },
		head_title: "Settings"
	});

}