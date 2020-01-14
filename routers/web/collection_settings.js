
const { universal_handlebar } = require("../../config.json");
const { get_user } = require("../../util/user");
const { get_collection } = require("../../util");

// Settings main router
module.exports = async (req, res) => {

	let palette_slug = req.params.slug;
	let collection = await get_collection(palette_slug);

	if(!collection) {
		res.redirect("../");
		return;
	}

	if(!req.user) {
		res.redirect("../");
		return;
	}

	let user = await get_user(req.user.id);

	// console.log(collection);

	res.render("collection_settings", {
		layout: "main",
		universal: universal_handlebar,
		user,
		page: { user, collection },
		head_title: "Settings"
	});

}