
const get_user_palette_permissions = require("./get_user_palette_permissions");
const { get_user } = require("./user");

module.exports = async (id, user) => {

	let current_user = await get_user(user); // `user` is an ID

	let palettes = db.collection("palettes");
	let palette = await palettes.findOne({ id });
	
	if(!palette) return null;

	let permissions = await get_user_palette_permissions(current_user, palette);
	
	if(!permissions.includes("read")) return null;
	if(palette.deleted) return null;

	palette.permissions = permissions;
	palette.people = [];
	palette.is_on_dashboard = ((current_user || {}).dashboard || []).includes(palette.id);

	for(let obj of palette.people_allowed) {
		let id = obj.id || obj;
		let user = await get_user(id);
		if(user) {
			palette.people.push({
				id,
				username: user.slug,
				name: user.user.displayName
			});
		}
	}
	palette.created_by_slug = palette.people.find(i => i.id == palette.created_by).username;

	return palette;
}