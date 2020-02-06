module.exports = {
	api: {
		collection: {
			collection: require("./api/collections/collection"),
			delete_collection: require("./api/collections/delete_collection"),
			get_members: require("./api/collections/get_members"),
			toggle_member: require("./api/collections/toggle_member"),
			set_title: require("./api/collections/set_title"),
			set_color: require("./api/collections/set_color"),
			set_bio: require("./api/collections/set_bio"),
			set_slug: require("./api/collections/set_slug"),
			addable: require("./api/collections/addable"),
			set_person_permissions: require("./api/collections/set_person_permissions")
		},
		new_collection: require("./api/collections/new_collection"),
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
		set_bio: require("./api/users/set_bio"),
		leave_palette: require("./api/palettes/leave_palette"),
		add_to_collection: require("./api/users/add_to_collection")
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

