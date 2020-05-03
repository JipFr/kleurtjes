let urlMatch = location.href.match(/\?q=(.+)/);
let searchQuery = urlMatch ? urlMatch[1] : "";
let palettes;

if(searchQuery) {
	fetch("/search/", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			query: searchQuery
		})
	}).then(d => d.json()).then(d => {
		console.log(d);
		palettes = d.palettes;
		let palettes_div = document.querySelector(".search_palettes");
		let users_div = document.querySelector(".search_users");
		let collections_div = document.querySelector(".search_collections");
		for(let [index, palette] of Object.entries(d.palettes)) {
			let node = get_palette({
				palette, 
				index,
				show_people: true
			});
			palettes_div.appendChild(node);
		}

		for(let [index, user] of Object.entries(d.users)) {
			let node = document.importNode(document.querySelector("template.middle_user").content, true);

			node.querySelector(".user_img").src = `/image/${user.id}`;
			node.querySelector(".user_name").innerText = user.name;
			
			node.querySelector(".user_slug").innerText = `u/${user.slug}`;
			node.querySelector(".user_slug").href = `/u/${user.slug}`;

			users_div.appendChild(node);
		}

		for(let [index, collection] of Object.entries(d.collections)) {
			let node = get_collection(collection);
			console.log(node);
			collections_div.appendChild(node);
		}

	});
} else {
	location.href = "/me";
}