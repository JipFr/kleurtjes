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
			text: text.slice(0, 20)
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
		on_submit: (response) => {
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
		on_submit: (response) => {
			// If on_submit is fired, the popup wasn't dismissed, meaning the user clicked delete.
			really_delete_palette(id);

			return true;
		},
		can_cancel: true,
		fields: []
	});
}

function add_color(id) {
	create_overlay({
		title: "Add color",
		btn_value: "Add",
		on_submit: (response) => {
			if(!response.color) return "Please put in a valid value for this color.";
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

let manage_open;
function manage_palette_people(id) {
	close_details();
	remove_overlays();

	manage_open = id;

	let palette = palettes.find(p => p.id == id);

	if(!palette) return false;

	let node = document.importNode(document.querySelector(".control_overlay_wrapper").content, true);

	node.querySelector(".overlay_inner").setAttribute("data-id", id);

	palette.people = palette.people.map(item => {
		let person = palette.people_allowed.find(i => item.id == i.id);
		item.write = (person.write || palette.created_by == item.id) ? true : false;
		return item;
	});

	palette.people.forEach(person => {
		let n_node = document.importNode(node.querySelector(".fields .user_small"), true);

		if(person.write) n_node.querySelector(".person_control.person_control_toggle_write").classList.add("write");

		n_node.querySelector(".name_main").innerText = person.name;
		n_node.querySelector(".username").innerText = `u/${person.username}`;
		n_node.querySelector(".user_small_pfp").src = `/image/${person.username}`;

		if(person.id == palette.created_by) {
			n_node.classList.add("is_self");
			n_node.querySelector(".person_control_remove").remove();
		} else {
			n_node.querySelector(".person_controls").setAttribute("data-person-username", person.username);
			n_node.querySelector(".person_control_toggle_write").setAttribute("data-can-write", person.write);
		}

		node.querySelector(".fields .all_users").appendChild(n_node);
	});

	// Remove example first child
	node.querySelector(".fields .user_small").remove();

	node.querySelector("#add_person").addEventListener("keyup", evt => {
		evt.key == "Enter" ? evt.target.closest(".input").querySelector("button").click() : "";
	});

	document.querySelector(".all").appendChild(node);

	document.querySelector("#add_person").focus();

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