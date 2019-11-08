module.exports = req => {
	let str;
	if(typeof req == "object") {
		str = req.url;
	} else {
		str = req;
	}

	if(!str.endsWith("/")) str += "/";
	let path = str.split("/");
	let current_page = path[path.length - 2].trim();

	if(str.includes("/p/")) return "palette";

	// If current page isn't any of those, it's probably the root directory for
	// the user's page, which is the dashboard.
	// Might tweak this later.
	current_page = ["own", "all", "collections"].includes(current_page) ? current_page : "dashboard";

	return current_page;
}