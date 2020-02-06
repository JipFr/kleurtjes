
let collections;
let page_user = document.querySelector(".user_main").dataset.user;
let me_user = document.body.dataset.youSlug;

function render() {
	fetch(location.pathname, {
		method: "POST"
	}).then(d => d.json()).then(d => {
		
		let collection_div = document.querySelector(".user_collections");

		collection_div.innerHTML = "";

		if(page_user === me_user) {
			let n_node = document.importNode(document.querySelector("template.small_collection").content, true);
			n_node.querySelector(".small_collection_inner").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`;
			n_node.querySelector("*").classList.add("add_collection");
			n_node.querySelector("*").addEventListener("click", prompt_new_palette);

			collection_div.appendChild(n_node);
		}

		collections = d.data.collections.sort((a, b) => (b.created_at || b.updated_at) - (a.created_at || b.created_at));

		for(let collection of collections) {
			let node = document.importNode(document.querySelector("template.small_collection").content, true);
			
			node.querySelector(".link").href = `/c/${collection.slug}/`;
			node.querySelector(".title_inner").innerText = collection.title;
			node.querySelector(".description").innerText = collection.description;
			node.querySelector(".palette_count").innerText = `${collection.palettes.length > 0 ? collection.palettes.length : "No"} palette${collection.palettes.length !== 1 ? "s" : ""}`;
				
			if(collection.color) node.querySelector("*").setAttribute("style", `--theme: ${collection.color};`);

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
			collection_div.classList.add("no_collections");
			collection_div.appendChild(document.querySelector("template.not_found").content);
		}

	});
}

window.addEventListener("load", render);

function prompt_new_palette() {
	create_overlay({
		title: "New collection",
		btn_value: "Create",
		on_submit: response => {
			console.log(response);

			create_collection({ ...response });

			return true;
		},
		can_cancel: true,
		fields: [
			{
				label: "Collection's name", 
				classes: ["name"],
				name: "name",
				placeholder: "My new collection",
				oninput: evt => {
					let slug_input = document.querySelector("[name='slug']");
					if(slug_input.getAttribute("data-has-typed") !== "true") slug_input.value = get_slug(evt.currentTarget.value);
				}
			},
			{
				label: "Slug", 
				classes: ["slug"],
				name: "slug",
				placeholder: "my-new-collection",
				oninput: evt => {
					evt.currentTarget.setAttribute("data-has-typed", true);
					evt.currentTarget.value = get_slug(evt.currentTarget.value);
				}
			},
			{
				label: "Description", 
				classes: ["description"],
				name: "description",
				placeholder: "This is my latest collection!"
			}
		]
	});
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
	return str.toLowerCase();
}

function create_collection({ name = null, slug = null, description = "" }) {
	if(!slug || !name) return false;
	

	fetch("/api/new_collection/", {
		method: "POST",
		body: JSON.stringify({
			name,
			slug,
			description
		}),
		headers: {
			"content-type": "application/json"
		}
	}).then(d => d.json()).then(d => {
		console.log(d);
		if(d.status !== 200) {
			show_error(d.err);
			return;
		}
		location.href = d.url;
	});

}