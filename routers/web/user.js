const { get_user } = require("../../util/user");
const { get_current_page } = require("../../util");
const { universal_handlebar } = require("../../config.json");

// User page router
const user_router = async (req, res) => {
	let current_page = get_current_page(req);
	let user_slug = req.params.username;

	let prefix = "";

	let page_user = await get_user(user_slug);
	let user = await get_user((req.user || {}).id);
	if(page_user) {

		if(current_page == "palette") {
			let palettes = db.collection("palettes");

			let url = req.url;
			if(!url.endsWith("/")) url += "/";
			let url_arr = url.split("/");
			let palette_name = url_arr[url_arr.length - 2];
			let all_palettes = await palettes.find({ created_by: page_user.id, visible: true }).toArray();

			let palette_ids = req.params.palette.split(",");
			
			new_palettes = all_palettes.filter(palette => {
				if(palette_ids.find(id => palette.id == id)) return true;
				if(palette_ids.find(name => palette.name.toLowerCase() == decodeURIComponent(palette_name).replace(/_/g, " ").toLowerCase())) return true;
				return false;
			});

			prefix = `${(new_palettes[0] || {}).name || "Unknown"} ${universal_handlebar.app_divider} `;

		}

		res.render("user_wrapper", {
			layout: "main",
			user,
			page: {
				user: page_user
			},
			is_same_user: page_user.mail == (user || {}).mail,
			current_page,
			universal: universal_handlebar,
			head_title: page_user ? `${prefix}${page_user.user.name.givenName}` : "User not found",
			palettes: req.params.palette
		});

	} else {
		// 404
		res.render("user_wrapper", {
			layout: "main",
			user: user,
			page: {
				user: {
					user: {
						displayName: "User not found!",
						photos: [
							{
								value: "https://media3.giphy.com/media/PekRU0CYIpXS8/giphy.gif?cid=94c10156dc5d9f0b169df50384d84a77791314c91c10b885&rid=giphy.gif"
							}
						]
					}
				}
			},
			is_same_user: false,
			current_page,
			universal: universal_handlebar,
			head_title: "User not found",
			palettes: [],
			not_found: true
		});
	}
}

module.exports = user_router;