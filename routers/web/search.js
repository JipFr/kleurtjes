
const { universal_handlebar } = require("../../config.json");
const { get_user } = require("../../util/user");

// Log in router
const search_router = async (req, res) => {
	
	let user = await get_user((req.user || {}).id);

	res.render("search", {
		layout: "main",
		universal: universal_handlebar,
		head_title: "Search",
		user,
		query: req.query
	});
}

module.exports = search_router;