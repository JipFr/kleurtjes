
let palette_to_add;

function create_new_palette(palette_name, add_to_dashboard) {
	if(!palette_name) return;
	fetch(`/api/new_palette/`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			name: palette_name,
			add_to_dashboard
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) {
			// Handle error
			return;
		} else {
			render();
		}
	});
}

function really_delete_palette(id) {
	fetch(`/api/delete_palette/`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			id: id
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) return;
		render();
	});
}

function add_new_color(id, color, text) {
	fetch(`/api/add_color/`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			id,
			value: color,
			text: text.slice(0, 30)
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) return;
		render();
	})
}

function new_palette() {
	create_overlay({
		title: "New palette",
		btn_value: "Add",
		on_submit: response => {
			if(response.name.trim().length < 1) {
				return "Please enter a valid palette's name";
			}

			create_new_palette(response.name.trim(), response.add_to_dashboard ? 1 : 0);

			return true;
		},
		can_cancel: true,
		fields: [
			{
				label: "Palette's name", 
				classes: ["name"],
				name: "name",
				placeholder: "Project A",
				accept_clipboard: true
			},
			{
				label: "Add to dashboard", 
				classes: ["add_to_dashboard"],
				name: "add_to_dashboard",
				type: "checkbox",
				checked: current_page == "dashboard"
			}
		]
	});
}

function delete_palette(id) {
	create_overlay({
		title: "Really delete palette?",
		btn_value: "Delete",
		btn_is_delete: true,
		on_submit: (response) => {
			// If on_submit is fired, the popup wasn't dismissed, meaning the user clicked delete.
			really_delete_palette(id);

			return true;
		},
		can_cancel: true,
	});
}

function add_color(id) {
	create_overlay({
		title: "Add color",
		btn_value: "Add",
		on_submit: (response) => {
			if(!response.color || !is_color(response.color)) return "Please put in a valid value for this color.";
			add_new_color(id, response.color, response.text);
			console.log(response);
			return true;
		},
		can_cancel: true,
		fields: [
			{
				label: "Color's value", 
				classes: ["color"],
				name: "color",
				placeholder: "#3d6a7b",
				accept_color_picker: true,
				accept_clipboard: true
			},
			{
				label: "What is this color?", 
				classes: ["text"],
				name: "text",
				placeholder: "Header"
			}
		]
	});
}

function delete_color(palette_id, color_identifier) {
	// TODO
	console.log(color_identifier, palette_id);
	fetch(`/api/delete_color/`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			palette_id,
			color: color_identifier
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) return;
		render();
	});
}

function toggle_person(username, palette_id, add = true) {
	console.log(username, palette_id);

	fetch(`/api/toggle_palette_person/`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			palette_id,
			username,
			add
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) return;
		render();
	});
}
function toggle_person_permissions(username, palette_id, write = true) {
	console.log(username, palette_id);

	fetch(`/api/toggle_palette_person_permissions/`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			palette_id,
			username,
			write
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) return;
		render();
	});
}

function is_color(value) {
	const s = new Option().style;
	s.color = value;
	return s.color !== "";
}

function add_to_collection(el) {
	close_details();
	let palette_wrapper = el.closest(".palette");
	let id = palette_wrapper.dataset.id;
	palette_to_add = id;

	// Remove collections that the user is an administrator of,
	// but already hold the current palette
	let new_addable = addable_collections
	  .filter(col => !col.palettes.find(palette => palette === id))
	  .sort((b, a) => a.updated_at - b.updated_at);
	  
	// NOW MAKE A UI SHOW UP
	let overlay_node = document.importNode(document.querySelector(".collection_list_wrapper").content, true);

	for(let collection of new_addable) {
		let node = document.importNode(overlay_node.querySelector(".smallest_collection"), true);

		if(collection.color) node.setAttribute("style", `--theme: ${collection.color}`);

		node.setAttribute("data-id", collection.id);
		node.querySelector(".title_inner").innerText = collection.title;

		node.querySelector(".collection_add_button").addEventListener("click", evt => {
			let el = evt.currentTarget.closest(".smallest_collection");
			let id = el.dataset.id;
			really_add_to_collection(id, palette_to_add);
		});

		overlay_node.querySelector(".fields").appendChild(node);
	}

	overlay_node.querySelector(".smallest_collection").remove();
	if(overlay_node.querySelector(".fields").children.length === 0) {
		let not_found_node = document.importNode(document.querySelector("template.not_found").content, true);
		not_found_node.querySelector("h2").innerHTML = "No available collections!";
		overlay_node.querySelector(".fields").appendChild(not_found_node);
	}

	document.querySelector(".all").appendChild(overlay_node);


}

function really_add_to_collection(collection, palette) {
	remove_overlays();
	fetch(`/api/add_to_collection/`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			collection_id: collection,
			palette_id: palette
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) {
			show_error(d.err);
			return;
		}
		update_addables()
		create_overlay({
			title: d.msg,
			can_cancel: false
		});
	});
}

function change_title(palette_id) {
	if(!palette_id) return;
	close_details();

	create_overlay({
		title: "Change title",
		btn_value: "Add",
		on_submit: res => {
			let new_title = res.title;
			if(new_title && new_title.length <= 0) {
				alert("Please insert a title");
				return;
			}

			fetch("/api/set_palette_title/", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					palette_id,
					new_title
				})
			}).then(d => d.json()).then(d => {
				if(d.status !== 200) {
					show_error(d.err);
					return;
				}
				render();
			});

			return true;
		},
		can_cancel: true,
		fields: [
			{
				label: "New title", 
				classes: ["title"],
				name: "title",
				placeholder: "Project B"
			}
		]
	});

}