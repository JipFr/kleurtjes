
const { universal_handlebar } = require("../../config.json");
const { get_user } = require("../../util/user");
const { get_collection } = require("../../util");

// Settings main router
module.exports = async (req, res) => {

	let collection_slug = req.params.slug;
	let collection = await get_collection(collection_slug);

	if(!collection && req.user) {
		res.redirect("/me/");
		return;
	}

	if(!req.user) {
		res.redirect(`/c/${collection_slug}/`);
		return;
	}

	let user = await get_user(req.user.id);

	let user_in_col = collection.members.find(u => u.id === user.id);
	if(!user_in_col || (user_in_col || {}).role !== "admin" || collection.owner !== user.id) {
		res.redirect(`/c/${collection_slug}`);
		return;
	}

	res.render("collection_settings", {
		layout: "main",
		universal: universal_handlebar,
		user,
		page: { user, collection },
		head_title: "Settings"
	});

}