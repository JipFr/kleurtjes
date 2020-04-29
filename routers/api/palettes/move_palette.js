
const { get_user } = require("../../../util/user");
const { get_collection } = require("../../../util/");

// Move palettes up and down
module.exports = async (req, res) => {

	let palette_id = req.body.id;
	let dir = req.body.dir;

	if(req.body.page === "collection-main") {
		

		if(!req.user) {
			res.status(403);
			res.json({
				status: 403,
				err: "User is not signed in"
			});
			return;
		}

		let collection = await get_collection(req.body.collection_id);

		// Get user object in members list
		// so that we can get the user's role
		let user_in_collection = collection.members.find(m => m.id === req.user.id);
		console.log(user_in_collection);  

		if(user_in_collection && user_in_collection.role === "admin") {
			// Everything seems to be in order. Move the thing!
			let palettes = collection.palettes;

			let palette_found = palettes.find(obj => obj.id === palette_id);
			let palette_index = palettes.indexOf(palette_found);

			let new_arr = [];
			if(dir == "up" && palette_index > 0) {
				new_arr = array_move(palettes, palette_index, palette_index - 1);
			} else if(dir == "down" && palette_index < palettes.length - 1) {
				new_arr = array_move(palettes, palette_index, palette_index + 1);
			} else {
				new_arr = palettes;
			}

			console.log(new_arr);

			let x = await db.collection("collections").updateOne({
				id: collection.id
			}, {
				$set: {
					palettes: new_arr
				}
			});
			console.log(x);

			res.json({
				status: 200
			});
		} else {
			res.status(403);
			if(!user_in_collection) {
				res.json({
					status: 403,
					err: "User is not a member of this collection"
				});
			} else {
				res.json({
					status: 403,
					err: "User is not an admin for this collection"
				});
			}
			return;
		}

	} else {
		let arr_key = (req.body.page && req.body.page == "dashboard") ? "dashboard" : "palettes";

		let user = await get_user(req.user.id);

		if(!user || !((user || {})[arr_key].includes(palette_id)) ) {
			res.status(403);
			res.json({
				status: 403,
				err: "User not signed in or palette not found"
			})
			return false;
		}

		let palettes = user[arr_key];
		let palette_index = palettes.indexOf(palette_id);

		let new_arr = [];
		if(dir == "up" && palette_index > 0) {
			new_arr = array_move(palettes, palette_index, palette_index - 1);
		} else if(dir == "down" && palette_index < palettes.length - 1) {
			new_arr = array_move(palettes, palette_index, palette_index + 1);
		} else {
			new_arr = palettes;
		}

		if(!new_arr.includes(palette_id)) {
			new_arr.unshift(palette_id);
		}

		let to_set = {}
		to_set[arr_key] = new_arr;

		// Update user
		await db.collection("users").updateOne({
			id: req.user.id
		}, {
			$set: to_set
		});

		res.json({
			status: 200
		});
	}

}

function array_move(arr, old_index, new_index) {
	if (new_index >= arr.length) {
		var k = new_index - arr.length + 1;
		while (k--) {
			arr.push(undefined);
		}
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr;
};