module.exports = async (user, palette) => {

	let permissions = ["read"];

	if(palette.deleted) return [];

	if(!user || !palette) return permissions;

	if(palette.created_by == user.id) {
		permissions.push("delete_palette");
		permissions.push("manage_people");
	}

	let is_inside = palette.people_allowed.find(i => i.id == user.id);
	if((is_inside && (is_inside.write || typeof is_inside == "string")) || palette.created_by == user.id) {
		permissions.push("delete_color");
		permissions.push("add_color");
	}

	if(user) {
		permissions.push("toggle_dashboard");
		permissions.push("move_location");
	}

	return permissions;

	// ["read", "add_color", ""]

}