
const { get_user } = require("../../user.js");

// Move palettes up and down
module.exports = async (req, res) => {

	let palette_id = req.body.id;
	let dir = req.body.dir;

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