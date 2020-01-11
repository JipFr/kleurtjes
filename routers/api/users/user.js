const { get_user } = require("../../../util/user");
const { get_current_page, get_user_palette_permissions } = require("../../../util");

// User POST router
const user_api_router = async (req, res) => {

	let current_page = get_current_page(req.headers.referer);

	let user = await get_user(req.params.username);

	if(user) {
		let new_palettes;
		let palettes = db.collection("palettes");

		if(current_page == "own") {
		
			new_palettes = user.palettes.map(i => palettes.findOne({id: i, visible: true}));
			new_palettes = await Promise.all(new_palettes);
			new_palettes = new_palettes.filter(i => i ? true : false);
		
		} else if(current_page == "all") {
		
			new_palettes = await palettes.find({visible: true, people_allowed_ids: { $all: [user.id] } } ).toArray();
			new_palettes = new_palettes.sort((a, b) => b.created_at - a.created_at);

		} else if(current_page == "dashboard") {
			
			new_palettes = (user || {}).dashboard || [];
			new_palettes = new_palettes.map(i => palettes.findOne({id: i, visible: true}));
			new_palettes = await Promise.all(new_palettes);

		} else if(current_page == "palette") {
			
			let all_palettes = await palettes.find({ created_by: user.id, visible: true }).toArray();

			let palette_ids = req.params.palette.split(",");
			
			new_palettes = all_palettes.filter(palette => {
				if(palette_ids.find(id => palette.id == id)) return true;
				if(palette_ids.find(name => palette.name.toLowerCase() == decodeURIComponent(name).replace(/_|-/g, " ").toLowerCase())) return true;
				return false;
			});

		} else if(current_page == "collections") {
			new_palettes = [];
		}

		new_palettes = new_palettes.filter(i => i ? true : false);

		// Update palettes with permissions and other dynamic stuff
		let current_user = await get_user((req.user || {}).id)		
		if(!current_user) current_user = {}
		for(let palette of new_palettes) {
			palette.permissions = await get_user_palette_permissions(req.user, palette);
			palette.people = [];
			palette.is_on_dashboard = (current_user.dashboard || []).includes(palette.id);
			
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
		}
		
		res.json({
			status: 200,
			your_id: (req.user || {}).id,
			data: {
				slug: user.slug,
				palettes: new_palettes.filter(i => i.permissions.includes("read"))
			}
		});
	} else {
		res.status(404);
		res.json({
			status: 404,
			your_id: (req.user || {}).id,
			data: {
				slug: null,
				palettes: []
			}
		});
	}
}

module.exports = user_api_router;