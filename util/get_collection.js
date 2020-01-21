// Get a collection object

const { get_user } = require("./user");

module.exports = async id => {
	if(!id) return null;
	let collections = db.collection("collections");

	let collection = await collections.findOne({ id });
	if(!collection) collection = await collections.findOne({ slug: id });

	if(!collection) return null;

	for(let obj of collection.members) {
		let u = await get_user(obj.id);
		obj.slug = (u || {}).slug;
		obj.display = u.user.displayName;
	}

	return collection;

}