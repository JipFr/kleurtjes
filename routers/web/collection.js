const { get_user } = require("../../util/user");
const { get_current_page } = require("../../util");
const { universal_handlebar } = require("../../config.json");

// User page router
const user_router = async (req, res) => {
	
	let user = await get_user((req.user || {}).id);
	let prefix = "";
	let page_collection = require("../../TMP-collection.json");
	let current_page = "main";

	let user_is_member;
	let user_role;
	if(user) {
		user_is_member = page_collection.members.find(u => u.slug === user.slug);
		user_role = user_is_member ? user_is_member.role : null;
	}

	res.render("collection_wrapper", {
		layout: "main",
		user: user,
		page: {
			collection: page_collection
		},
		current_page,
		universal: universal_handlebar,
		head_title: page_collection ? `${prefix}${page_collection.title}` : "Collection not found",
		palettes: req.params.palette,
		is_admin: user_role === "admin"
	});
}

module.exports = user_router;