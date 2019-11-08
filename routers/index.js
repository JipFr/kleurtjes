module.exports = {
	api: {
		new_palette: require("./api/new_palette"),
		delete_palette: require("./api/delete_palette"),
		add_color: require("./api/add_color"),
		delete_color: require("./api/delete_color"),
		user_api: require("./api/user"),
		toggle_palette_dashboard: require("./api/toggle_palette_dashboard"),
		toggle_palette_person: require("./api/toggle_palette_person"),
		toggle_palette_person_permissions: require("./api/toggle_palette_person_permissions"),
		move_palette: require("./api/move_palette"),
		set_username: require("./api/set_username"),
		set_color: require("./api/set_color")
	},
	web: {
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

