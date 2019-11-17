// Get user
const get_user = async (slug) => {
	if(typeof slug == "undefined" || !slug) return null;
	let users = db.collection("users");
	let user;
	if(slug.includes("@")) {
		user = await users.findOne({mail: slug});
	} else {
		user = await users.findOne({slug: slug.toLowerCase()});
	}
	if(!user) user = await users.findOne({id: slug});
	return user;
}

// Export
module.exports = {
	get_user
}