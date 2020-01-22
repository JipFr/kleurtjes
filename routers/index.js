module.exports = {
	api: {
		collection: {
			collection: require("./api/collections/collection"),
			get_members: require("./api/collections/get_members"),
			add_member: require("./api/collections/add_member"),
			set_title: require("./api/collections/set_title"),
			set_color: require("./api/collections/set_color"),
			set_bio: require("./api/collections/set_bio"),
			set_slug: require("./api/collections/set_slug")
		},
		new_palette: require("./api/palettes/new_palette"),
		delete_palette: require("./api/palettes/delete_palette"),
		add_color: require("./api/palettes/add_color"),
		delete_color: require("./api/palettes/delete_color"),
		user_api: require("./api/users/user"),
		toggle_palette_dashboard: require("./api/palettes/toggle_palette_dashboard"),
		toggle_palette_person: require("./api/palettes/toggle_palette_person"),
		toggle_palette_person_permissions: require("./api/palettes/toggle_palette_person_permissions"),
		move_palette: require("./api/palettes/move_palette"),
		set_username: require("./api/users/set_username"),
		set_color: require("./api/users/set_color"),
		set_bio: require("./api/users/set_bio")
	},
	web: {
		collection: require("./web/collection"),
		collection_settings: require("./web/collection_settings"),
		user_palette: require("./web/user"),
		user_collections: require("./web/user_collections"),
		me: require("./web/me"),
		home: require("./web/home"),
		log_in: require("./web/log_in"),
		settings: require("./web/settings")
	},
	other: {
		image: require("./other/image")
	}
}

