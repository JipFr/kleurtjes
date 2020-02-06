
// Get all connections the user can add palettes to
const { get_collection } = require("../../../util");
const { get_user } = require("../../../util/user");

module.exports = async (req, res) => {

	if(!req.user) {
		res.json({
			status: 200,
			addable: [],
			empty_reason: "User not logged in"
		});
		return;
	}

	let user = await get_user(req.user.id);

	let collections = db.collection("collections");
	let matches = await collections.find({ 
		members: {
			$elemMatch: {
				id: user.id,
				role: "admin"
			}
		},
		visible: true
	}).toArray();

	let addable = matches.map(match => {

		return {
			title: match.title,
			color: match.color,
			id: match.id,
			owner: match.owner,
			slug: match.slug,
			palettes: match.palettes.map(palette => palette.id),
			updated_at: match.updated_at || null
		}

	});

	res.json({
		status: 200,
		addable
	});
}