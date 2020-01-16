
let collections;

function render() {
	fetch(location.pathname, {
		method: "POST"
	}).then(d => d.json()).then(d => {
		
		let collection_div = document.querySelector(".user_collections");

		collection_div.innerHTML = "";

		collections = d.data.collections.sort((a, b) => (b.created_at || b.updated_at) - (a.created_at || b.created_at));

		for(let collection of collections) {
			let node = document.importNode(document.querySelector("template.small_collection").content, true);
			
			node.querySelector(".link").href = `/c/${collection.slug}/`;
			node.querySelector(".title").innerHTML = collection.title;
			node.querySelector(".description").innerHTML = collection.description;
			node.querySelector(".palette_count").innerHTML = `${collection.palettes.length > 0 ? collection.palettes.length : "No"} palette${collection.palettes.length !== 1 ? "s" : ""}`;
			
			// Add users
			let user_list = node.querySelector(".user_list");
			for(let member of collection.members.slice(0, 5)) {
				let pfp_node = document.importNode(user_list.children[0], true);
				pfp_node.href = `/u/${member.slug}/`;
				pfp_node.querySelector("img").src = `/image/${member.id}/`;
				user_list.appendChild(pfp_node);
			}
			// If members list has more than 5 members, show the "more" icon
			if(collection.members.length > 5) {
				let more_node = document.importNode(user_list.children[0], true);
				more_node.removeAttribute("href");
				more_node.querySelector("img").src = "/more.png";
				user_list.appendChild(more_node);
			}
			user_list.children[0].remove();


			collection_div.appendChild(node);
		
		}

		if(collection_div.children.length === 0) {
			collection_div.appendChild(document.querySelector("template.not_found").content);
		}

	});
}

window.addEventListener("load", render);