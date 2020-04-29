
let current_page = document.body.getAttribute("data-page");
let page_username = document.querySelector(".user_main") ? document.querySelector(".user_main").dataset.user || null : null;
let my_username = document.body.dataset.youSlug;
let me = document.body.dataset.you;
let addable_collections = [];

function create_overlay({title = "...", fields = [], can_cancel = false, btn_value = "OK", on_submit = _ => true, btn_is_delete = false}) {

	document.querySelectorAll(":focus").forEach(el => el.blur());

	let overlay_content = document.querySelector(".templates template.overlay_wrapper").content;
	let overlay = document.importNode(overlay_content, true);

	overlay.querySelector(".title").innerText = title;

	fields.forEach(field => {

		let input_div;
		if(field.type == "checkbox") {

			input_div = document.importNode(document.querySelector(".templates template.checkbox_input").content, true);

			if(field.checked) input_div.querySelector("input").checked = true;

		} else {

			input_div = document.importNode(document.querySelector(".templates template.input_div").content, true);

			input_div.querySelector("input").placeholder = field.placeholder || "";
			input_div.querySelector("input").classList.add("enterable");
			if(field.value) {
				input_div.querySelector("input").value = field.value;
				input_div.querySelector("input").placeholder = field.value;
			}

			if(!field.accept_color_picker) {
				input_div.querySelector(".color_picker_wrapper").remove();
				input_div.querySelector(".input input").removeAttribute("oninput");
			} else {
				input_div.querySelector(".color_picker_input").value = field.placeholder || "";
				input_div.querySelector(".main_input").setAttribute("maxlength", 20);
				input_div.querySelector(".color_picker_wrapper").setAttribute("style", `background: ${field.placeholder}`);
			}

		}

		if(field.oninput) input_div.querySelector("input").addEventListener("input", field.oninput);

		input_div.querySelector("label").innerText = field.label;
		input_div.querySelector("label").setAttribute("for", field.name);

		input_div.querySelector("input").setAttribute("name", field.name);
		input_div.querySelector("input").id = field.name;

		input_div.querySelector("input").setAttribute("maxlength", 100);

		for(let item of field.classes) {
			input_div.querySelector(".input_div").classList.add(item);
		}

		overlay.querySelector(".fields").appendChild(input_div);

	});

	if(!can_cancel) overlay.querySelector("button.cancel").remove();

	if(btn_is_delete) overlay.querySelector("button.submit").classList.add("delete");
	overlay.querySelector("button.submit").innerText = btn_value;
	overlay.querySelector("button.submit").addEventListener("click", () => {
		let responses = {}

		document.querySelectorAll(".all .overlay_wrapper input").forEach(input => {
			if(input.type == "text") {
				responses[input.getAttribute("name")] = input.value;
			} else if(input.type == "checkbox") {
				responses[input.getAttribute("name")] = input.checked;
			}
		});

		let should_remove = on_submit(responses);
		if(should_remove && typeof should_remove == "boolean") {
			remove_overlays();
		} else if(should_remove) {
			alert(should_remove);
		}
	});

	document.querySelector(".all").appendChild(overlay);
	let to_focus = document.querySelector(".all .overlay_wrapper input");

	to_focus ? to_focus.focus() : document.querySelector(".overlay_wrapper button").focus();

	document.body.classList.add("hide_y");

}

function remove_overlays() {
	manage_open = undefined;
	document.querySelectorAll(".all .overlay_wrapper").forEach(overlay => {
		overlay.remove();
	});
	document.body.classList.remove("hide_y");
}

const sw = true;
if (sw && navigator.onLine) {

	if ('serviceWorker' in navigator) {

		window.addEventListener('load', function() {
			navigator.serviceWorker.register("/sw.js").then(reg => {

			}, err => {
				console.log(err)
			});
		});

	}
} else if (!sw && navigator.onLine) {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations().then(function(registrations) {
			for (var registration of registrations) {
				registration.unregister();
			}
		});
	}
}

function update_theme_color() {
	// Just trying this out. I hope it works
	let rgb = window.getComputedStyle(document.querySelector("header"), null).getPropertyValue("background-color");
	let colors = rgb.match(/(\d+), (\d+), (\d+)/).slice(1, 4).map(n => Number(n));
	document.querySelector(`meta[name="theme-color"]`).content = `rgb(${colors.join(", ")})`;
	// document.querySelector(`[name="theme-color"]`).setAttribute("content", get_style(document.querySelector("header"), "backgroundColor"));
}

update_theme_color();
setInterval(update_theme_color, 1e3);

function get_style(el, prop) {
	return el.currentStyle ? el.currentStyle[prop] : document.defaultView.getComputedStyle(el, null)[prop];
}

function enter(el, evt) {
	if(evt.key !== "Enter") return;
	if(!el.classList.contains("enterable")) return;
	// To next input
	let enterables = [...el.closest(".overlay_inner").querySelectorAll(".enterable")];
	let current_index = enterables.indexOf(el);
	let next_el = enterables[current_index + 1];

	if(next_el && next_el.nodeName == "INPUT") {
		next_el.focus();
	} else if(next_el && next_el.nodeName == "BUTTON") {
		next_el.click();
	}

}

function copy(str) {
	const el = document.createElement("input");
	el.value = str;
	document.body.appendChild(el);
	el.select();
	document.execCommand("copy");
	el.remove();
}

function copy_color(evt) {
	let el = evt.target;
	let color = el.querySelector(".hover_color").innerText;
	copy(color);
	document.querySelectorAll(".activate_animation").forEach(el => el.classList.remove("activate_animation"));
	el.querySelector(".copy_animation").classList.add("activate_animation");
	setTimeout(() => {
		el.querySelector(".copy_animation").classList.remove("activate_animation");
	}, 1e3);
}

function update_radius() {

	document.querySelectorAll(".round_bottom_right").forEach(el => el.classList.remove("round_bottom_right"));

	document.querySelectorAll(".palette_colors").forEach(div => {

		let should_check = div.scrollHeight > 100;
		let on_row = 0;
		let start_y = null;

		if(should_check) {
			let all_colors = div.querySelectorAll(".color");

			all_colors.forEach(color => {
				let color_pos = color.getBoundingClientRect();
				if(start_y === null) start_y = color_pos.top;
				if(start_y === color_pos.top) {
					on_row++
				}
			});

			let row_index = all_colors.length % on_row;
			// No final element should be rounded if
			// the below if statement is true
			if(row_index !== 0) {
				let final = Math.floor(all_colors.length / on_row);
				let element_index = (final * on_row) - 1;
				all_colors[element_index].classList.add("round_bottom_right");
			}

		}

	});

	// For top right rounding
	document.querySelectorAll(".palette_colors").forEach(div => {
		if(div.scrollHeight == 100) {
			div.classList.add("round_last");
		} else {
			div.classList.remove("round_last");
		}
	});
}

window.addEventListener("resize", update_radius);

function get_palette({ 
	palette, 
	can_move_up = false, 
	can_move_down = false, 
	is_owner = false,
	show_people = false }) {
	// Add divs
	let content = document.querySelector(".palette_template").content;
	let node = document.importNode(content, true);

	node.querySelector(".palette_name").innerText = palette.name;

	// Remove control buttons
	if((document.body.dataset.collection === "" || document.body.dataset.isCollectionAdmin !== "true") && node.querySelector(".remove_from_collection")) node.querySelector(".remove_from_collection").remove();
	if(!me) node.querySelector(".add_to_collection").remove();
	if(!palette.permissions.includes("change_title")) node.querySelector(".change_title").remove();
	if(!palette.permissions.includes("delete_palette")) node.querySelector(".delete_palette").remove();
	if(!palette.permissions.includes("manage_people")) node.querySelector(".manage_people .grid_info").innerHTML = "People";
	if(!palette.permissions.includes("toggle_dashboard")) node.querySelector(".toggle_dashboard").remove();

	if(!navigator.share) node.querySelector(".share_palette").remove();

	if(palette.created_by == me || !palette.people_allowed.find(i => i.id === me)) {
		node.querySelector(".leave_palette").remove();
	}

	// Update user imgs
	let image_wrapper = node.querySelector(".user_list");
	if(palette.people.length > 1 || (palette.people.length == 1 && palette.people[0].id !== me) || show_people) {
		palette.people.slice(0, 5).forEach(user => {
			let node_alt = document.importNode(image_wrapper, true).children[0];

			node_alt.href = `/u/${user.username}/`
			node_alt.querySelector(".pfp_small").src = `/image/${user.id}`;

			node.querySelector(".user_list").appendChild(node_alt);
		});
	} else {
		node.querySelector(".user_list").remove();
	}

	// Remove initial image (placeholder) OR show "..." 
	// if there's 5 or more people in the palette
	if(palette.people.length >= 5) {
		let n = image_wrapper.children[0];

		n.querySelector("img").src = "/more.png";
		let p_id = palette.id;
		n.addEventListener("click", () => {
			manage_palette_people(p_id);
		});
		n.removeAttribute("href");

		image_wrapper.appendChild(n);
	} else {
		image_wrapper.children[0].remove();
	}


	// Remove moving options should that be neccesary
	if(!can_move_up) {
		node.querySelector(".palette_placement .grid_icon:first-child").innerHTML = "";
	}
	if(!can_move_down) {
		node.querySelector(".palette_placement .grid_icon:last-child").innerHTML = "";
	}
	if(!can_move_up && !can_move_down) {
		node.querySelector(".placement_wrapper").remove();
	}

	// Add colors
	let content_alt = node.querySelector(".palette_colors");

	palette.colors.forEach((color, index) => {
		let node_alt = document.importNode(content_alt, true).children[0];

		node_alt.querySelector(".color").setAttribute("style", `--color: ${color.value}`);
		node_alt.querySelector(".hover_text span").innerText = color.text.slice(0, 100) || `Color ${index + 1}`;
		node_alt.querySelector(".color_added_by").src = `/image/${color.added_by}`;
		node_alt.querySelector(".color_added_by").setAttribute("alt", palette.people.find(i => i.id == color.added_by).username);
		node_alt.querySelector(".hover_color").innerText = color.value;

		node_alt.querySelector(".color").addEventListener("click", copy_color);

		node_alt.querySelector(".color").parentNode.setAttribute("data-index", index);
		node_alt.querySelector(".color").parentNode.setAttribute("data-id", color.id);
		node_alt.querySelector(".color").parentNode.setAttribute("data-color", color.value);

		if(palette.permissions.includes("delete_color")) {
			node_alt.querySelector(".color").parentNode.addEventListener("contextmenu", evt => {
				evt.preventDefault();

				create_overlay({
					title: `Delete ${evt.target.parentNode.getAttribute('data-color')} from ${evt.target.closest(".palette").querySelector(".palette_name").innerText}?`,
					btn_value: "Delete",
					btn_is_delete: true,
					on_submit: (response) => {
						// If on_submit is fired, the popup wasn't dismissed, meaning the user clicked delete.
						let color_wrapper = evt.target.closest(".color_wrapper") || evt.target;

						delete_color(color_wrapper.closest(".palette").getAttribute("data-id"), color_wrapper.getAttribute("data-id") || color_wrapper.getAttribute("data-index"));

						return true;
					},
					can_cancel: true,
					fields: []
				});

			});
		}

		node.querySelector(".palette_colors").appendChild(node_alt);
	});

	if(palette.permissions.includes("add_color")) {
		// Add "plus" button
		let node_alt = document.importNode(content_alt, true).children[0];
		node_alt.querySelector("div").classList.add("is_add_button");
		node_alt.querySelector(".color").setAttribute("style", `background: var(--border);`);
		node_alt.querySelector(".color_hover").remove();
		node_alt.querySelector(".color").setAttribute("onclick", `add_color(this.closest('.palette').getAttribute('data-id'))`)
		node_alt.querySelector(".color").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`;

		node.querySelector(".palette_colors").appendChild(node_alt);
	}

	// Remove black placeholder
	node.querySelector(".color_wrapper").remove();
	node.querySelector(".palette").setAttribute("data-id", palette.id);
	node.querySelector(".palette").setAttribute("data-permissions", palette.permissions);

	node.querySelector(".palette_url").href = get_url(palette);

	if(palette.is_on_dashboard && node.querySelector(".is_on_dashboard")) {
		node.querySelector(".is_on_dashboard").remove();
	} else if(node.querySelector(".not_on_dashboard")) {
		node.querySelector(".not_on_dashboard").remove();
	}

	let dropdown = node.querySelector(".dropdown");
	let removed_hr = false;
	while(!removed_hr) {
		let last_child = dropdown.children[dropdown.children.length - 1];
		if(last_child.nodeName == "HR") {
			last_child.remove();
		} else {
			removed_hr = true;
		}
	}
	return node;
}

document.addEventListener("click", evt => {
	// Close detail elements if clicking elsewhere
	let path = evt.path || [];
	document.querySelectorAll("details.close_on_click[open]").forEach(el => {
		if(!path.includes(el)) {
			el.removeAttribute("open");
		}
	});
});

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
		n_node.querySelector(".username").href = `/u/${person.username}`;
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

function share_palette(palette_wrapper) {
	let id = palette_wrapper.dataset.id;
	let palette = palettes.find(palette => palette.id === id);
	if(!palette) return;

	try {
		navigator.share({
			title: palette.name,
			url: get_url(palette),
			text: `Check out the ${palette.name} palette by u/${palette.created_by_slug}!`
		});
	} catch(err) {
		show_error(`Error: ${err}`)
	}

}

function show_error(err) {
	create_overlay({
		title: `${err}`,
		btn_value: "OK",
		on_submit: res => true,
		can_cancel: false,
		fields: []
	});
}

function get_url(palette) {
	return `/u/${palette.created_by_slug}/${encodeURIComponent(palette.name.replace(/ /g, "-").toLowerCase())}/`;
}

// Get all collections the user can add to
window.addEventListener("load", update_addables);
async function update_addables() {
	let addable_req = await fetch("/api/c/addable");
	let addable = await addable_req.json();
	if(addable.status === 200) addable_collections = addable.addable;
}

function leave_palette(id) {
	close_details();

	create_overlay({
		title: "Really stop being a member of this palette?",
		on_submit: res => {
			fetch(`/api/leave_palette/?id=${id}`, {
				method: "POST"
			}).then(d => d.json()).then(d => {
				console.log(d);
				if(!d.status == 200) return;
				render();
			});
			return true;
		},
		can_cancel: true
	});
}