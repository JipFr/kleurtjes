
// Generate random (ish) collections FOR TESTING PURPOSES

let { db_name } = require("./config.json");

const { gen_str } = require("./util");
const { MongoClient } = require("mongodb");
const db_url = "mongodb://localhost:27017/" + db_name;

MongoClient.connect(db_url, {	
	useNewUrlParser: true,
	useUnifiedTopology: true
	}, (err, client) => {
	if(err) {
		logger.error(err, "BgRed");
		return;
	}
	db = client.db(db_name);
	console.info(`[STARTUP] Established DB connection`);
	make();
});

async function make() {
	let coll_id = gen_str();
	let collections = db.collection("collections");

	let p_col = db.collection("palettes");
	let all_palettes = await p_col.find({ visible: true }).toArray();
	let palettes = [];
	// for(let i = 0; i < Math.floor(Math.random() * 4); i++) {
	// 	palettes.push(all_palettes[Math.floor(Math.random() * all_palettes.length)].id);
	// }
	for(let palette of all_palettes) {
		palettes.push(palette.id);
	}

	collections.updateOne({ id: coll_id },
	{
		$set: {
			"title": "Collectie " + new Date().toJSON(),
			"description": "This is a temporary text to indicate that collections can have a description.",
			"slug": Math.floor(Math.random() * 500).toString(),
			"deleted": false,
			"visible": true,
			"created_at": Date.now(),
			"created_by": "ihw13-0flrn-g10lg-v62nu-rqd2o-ms6y5-2m5ol-55do3-84py3-1m9ig",
			"members": [
				{
					"id": "ihw13-0flrn-g10lg-v62nu-rqd2o-ms6y5-2m5ol-55do3-84py3-1m9ig",
					"role": "admin"
				},
				{
					"id": "lvxob-a4kq5-sjukv-3jq3h-oq0qt-8zih7-8p0c9-44jis-wdou6-fcktg",
					"role": "member"
				}
			],
			"palettes": palettes.map(id => ({ id }) )
		}
	}, {
		upsert: true
	});

	console.log("Created new entry");

}