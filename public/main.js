let current_page = document.body.getAttribute("data-page");
let page_username = document.querySelector(".user_main").getAttribute("data-user");
let my_username = document.body.getAttribute("data-you-slug");

let palettes;
function render() {
	// Render all palettes
	fetch(location.pathname, {
		method: "POST"
	}).then(d => d.json()).then(d => {
		let div = document.querySelector(".palettes");
		div.innerHTML = "";

		// Cycle through palettes
		palettes = d.data.palettes;

		if(typeof manage_open !== "undefined") {
			console.log("manage_open is not undefined, opening");
			manage_palette_people(manage_open);
		}

		if(palettes.length > 0) {
			palettes.forEach((palette, index) => {

				let node = get_palette({
					palette, 
					index, 
					can_move_down: index < d.data.palettes.length - 1 && palettes.length > 1,
					can_move_up: index > 0 && palettes.length > 1,
					is_owner: palette.people_allowed[0].id == d.your_id
				});

				div.appendChild(node);

			});

			update_radius();
		} else {
			document.querySelector(".palettes").appendChild(document.querySelector("template.not_found").content);
		}

	});

}

window.addEventListener("load", render);

function close_details() {
	document.querySelectorAll("details[open]").forEach(el => {
		el.removeAttribute("open");
	});
}

function toggle_palette_dashboard(id) {
	close_details();
	fetch(`/api/toggle_palette_dashboard/?id=${id}`, {
		method: "POST"
	}).then(d => d.json()).then(d => {
		if(!d.status == 200) return;
		render();
	});
}

function move_palette(direction, id) {
	console.log(direction, id);
	fetch(`/api/move_palette/`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			dir: direction,
			id,
			page: current_page
		})
	}).then(d => d.json()).then(d => {
		if(!d.status == 200) return;
		render();
	});
	close_details();
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

	if(!palette.permissions.includes("manage_people")) {
		node.querySelector(".title").innerHTML = "People in this palette";
		node.querySelector(".input_div").remove();
		node.querySelectorAll(".person_control_toggle_write").forEach(el => {
			el.removeAttribute("onclick");
			el.classList.add("no_cursor");
		});
		node.querySelectorAll(".person_control_remove").forEach(el => el.remove());
	}

	document.querySelector(".all").appendChild(node);

	if(document.querySelector("#add_person")) document.querySelector("#add_person").focus();

}