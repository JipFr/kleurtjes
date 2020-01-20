
const { get_collection } = require("../../../util");
const { get_user } = require("../../../util/user");

module.exports = async (req, res) => {

	if(!req.user) {
		res.status(401);
		res.json({
			status: 401,
			err: "User is not signed in" 
		});
		return;
	}

	let new_slug = get_slug(req.body.new_slug.trim());
	let collection = await get_collection(req.body.collection);
	let user = await get_user(req.user.id);

	if(user.id !== (collection.created_by || collection.owner)) {
		res.status(401);
		res.json({
			status: 401,
			err: "User is not the owner"
		});
		return;
	}

	if(collection.slug.trim() == new_slug) {
		res.status(400);
		res.json({
			status: 400,
			err: "This is already the collection's current slug" 
		});
		return;
	}

	if(new_slug.length <= 0) {
		res.status(400);
		res.json({
			status: 400,
			err: "Invalid slug"
		});
		return;
	}

	let collections = db.collection("collections");

	let slug_check = await collections.findOne({ slug: new_slug });
	if(slug_check) {
		res.status(400);
		res.json({
			status: 400,
			err: "Slug already exists"
		});
		return;
	}

	await collections.updateOne({
		id: collection.id
	},
	{
		$set: {
			slug: new_slug
		}
	}, { upsert: false });

	res.json({
		status: 200,
		new_slug
	})
}

function get_slug(slug) {
	let allowed = "abcdefghijklmnopqrstuvwxyz";
	allowed += allowed.toUpperCase();
	allowed += "-0987654321";

	let str = "";
	let chars = slug.split("");
	for(let char of chars) {
		if(allowed.includes(char)) {
			str += char;
		} else if(!str.endsWith("-")) {
			str += "-";
		}
	}
	return str;
}