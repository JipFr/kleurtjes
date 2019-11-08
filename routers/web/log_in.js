
const { universal_handlebar } = require("../../config.json");

// Log in router
const log_in_router = (req, res) => {
	res.render("login", {
		layout: "main",
		universal: universal_handlebar,
		head_title: "Log in"
	});
}

module.exports = log_in_router;