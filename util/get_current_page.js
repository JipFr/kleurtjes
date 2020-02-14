module.exports = req => {
	if(!req) {
		console.log(req);
		return null;
	}
	let str;
	if(typeof req == "object") {
		str = req.url;
	} else {
		str = req;
		if(str.startsWith("http")) str = `/${str.split("/").slice(3).join("/")}`
	}

	if(!str.endsWith("/")) str += "/";
	let path = str.split("/").filter(i => i);
	let current_page = path[path.length - 1].trim();

	if(str.startsWith("/p/")) return "palette";
	
	// Path length determines depth. Just 2 is likely `/u/username/`.
	// 3 is likely `/u/username/whatever/`.
	// This checks if it isn't one of the main nav items, and if it isn't it returns palette.
	if(path.length === 2) current_page = "dashboard";
	if(path.length >= 3 && !(["own", "all", "collections"].includes(current_page))) current_page = "palette";

	return current_page;
}