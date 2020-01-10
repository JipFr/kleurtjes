const { get_user } = require("../../util/user");
const { get_current_page } = require("../../util");
const { universal_handlebar } = require("../../config.json");

// User page router
const user_router = async (req, res) => {
	let current_page = get_current_page(req);
	let user_slug = req.params.username;

	let page_user = await get_user(user_slug);
	if(page_user) {
		let user = await get_user((req.user || {}).slug);

		let collections = (page_user || {}).collections || [];

		res.render("user_wrapper", {
			layout: "main",
			user: user,
			page: {
				user: page_user
			},
			is_same_user: page_user.mail == (user || {}).mail,
			universal: universal_handlebar,
			head_title: page_user ? `${page_user.user.name.givenName}` : "User not found",
			is_collections: true,
			collections,
			current_page
		});

	} else {
		res.send("NO");
	}
}

module.exports = user_router;