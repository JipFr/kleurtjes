const { get_user } = require("../../../util/user");
const { get_current_page, get_user_palette_permissions, get_palette, get_collection } = require("../../../util");

// User POST router
const user_api_router = async (req, res) => {

	let current_page = get_current_page(req.headers.referer);

	let user = await get_user(req.params.username);

	if(user) {
		let new_palettes;
		let new_collections;
		let palettes = db.collection("palettes");

		if(current_page == "own") {
		
			new_palettes = user.palettes.map(i => palettes.findOne({id: i, visible: true}));
			new_palettes = await Promise.all(new_palettes);
			new_palettes = new_palettes.filter(i => i ? true : false);
		
		} else if(current_page == "all") {
		
			new_palettes = await palettes.find({visible: true, people_allowed_ids: { $all: [user.id] } } ).toArray();
			new_palettes = new_palettes.sort((a, b) => (b.updated_at || b.created_at) - (a.updated_at || a.created_at));

		} else if(current_page == "dashboard") {
			
			new_palettes = (user || {}).dashboard || [];
			new_palettes = new_palettes.map(i => palettes.findOne({id: i, visible: true}));
			new_palettes = await Promise.all(new_palettes);

		} else if(current_page == "palette") {

			let all_palettes = await palettes.find({ created_by: user.id, visible: true }).toArray();

			let palette_ids = req.params.palette.split(",");

			new_palettes = all_palettes.filter(palette => {
				if(palette_ids.find(id => palette.id == id)) return true;
				if(palette_ids.find(name => {

					return palette.name.toLowerCase().replace(/_|-/g, " ") == decodeURIComponent(name).replace(/_|-/g, " ").toLowerCase()

				})) return true;
				return false;
			});

		} else if(current_page == "collections") {
			new_palettes = [];

			let collections = db.collection("collections");

			let u_collections = await collections.find({ 
				members: {
					$elemMatch: {
						id: user.id
					}
				}
			}).toArray();
			new_collections = await Promise.all(u_collections.map(c => get_collection(c.id)));
			new_collections = new_collections.filter(c => c && c.visible).map(collection => {
				with(collection) {
					if(typeof updated_at === "undefined") updated_at = created_at;
					return {
						id,
						created_at,
						created_by,
						updated_at,
						description,
						title,
						members,
						palettes,
						slug,
						color: typeof color !== "undefined" ? color : null
					}
				}
			});

			for(let collection of new_collections) {
				collection.palettes = await new Promise(resolve => {
					Promise.all(collection.palettes.map(obj => {
						let id = obj.id;
						return get_palette(id);
					})).then(resolve);
				});
				collection.palettes = collection.palettes.filter(i => i);
			}

		}

		new_palettes = new_palettes.filter(i => i ? true : false);

		// Update palettes with permissions and other dynamic stuff
		let current_user = await get_user((req.user || {}).id)		
		if(!current_user) current_user = {}
		new_palettes = await Promise.all(new_palettes.map(palette => get_palette(palette.id, (req.user || {}).id)));

		res.json({
			status: 200,
			your_id: (req.user || {}).id,
			data: {
				slug: user.slug,
				palettes: new_palettes.filter(i => i.permissions.includes("read")),
				collections: new_collections || []
			}
		});
	} else {
		res.status(404);
		res.json({
			status: 404,
			your_id: (req.user || {}).id,
			data: {
				slug: null,
				palettes: [],
				collections: []
			}
		});
	}
}

module.exports = user_api_router;