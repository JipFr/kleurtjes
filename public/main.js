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
			manage_palette_people(manage_open);
		}

		if(palettes.length > 0) {
			palettes.forEach((palette, index) => {

				// Add divs
				let content = document.querySelector(".palette_template").content;
				let node = document.importNode(content, true);

				node.querySelector(".palette_name").innerText = palette.name;

				// Remove control buttons
				if(!palette.permissions.includes("delete_palette")) node.querySelector(".delete_palette").remove();
				if(!palette.permissions.includes("manage_people")) node.querySelector(".manage_people").remove();
				if(!palette.permissions.includes("toggle_dashboard")) node.querySelector(".toggle_dashboard").remove();

				// Update user imgs
				let image_wrapper = node.querySelector(".palette_users");
				if(palette.people.length > 1 || (palette.people.length == 1 && palette.people_allowed[0].id !== d.your_id && current_page == "dashboard")) {
					palette.people.slice(0, 5).forEach(user => {
						let node_alt = document.importNode(image_wrapper, true).children[0];

						node_alt.href = `/u/${user.username}/`
						node_alt.querySelector(".pfp_small").src = `/image/${user.id}`;

						node.querySelector(".palette_users").appendChild(node_alt);
					});
				} else {
					node.querySelector(".palette_users").remove();
				}

				// Remove initial image (placeholder) OR show "..." 
				// if there's 5 or more people in the palette
				if(palette.people.length >= 5) {
					let n = image_wrapper.children[0];

					n.querySelector("img").src = "/more.png";
					n.querySelector("img").classList.remove("pointer");
					n.removeAttribute("href");

					image_wrapper.appendChild(n);
				} else {
					image_wrapper.children[0].remove();
				}
				

				// Remove moving options if not dashboard
				if(!(current_page == "own" || current_page == "dashboard") || my_username !== page_username || !palette.permissions.includes("move_location")) {
					node.querySelectorAll(".placement_wrapper").forEach(el => {
						el.remove();
					});
				} else {
					if(index == 0) {
						node.querySelector(".palette_placement .grid_icon:first-child").innerHTML = "";
					}
					if(index == d.data.palettes.length - 1) {
						node.querySelector(".palette_placement .grid_icon:last-child").innerHTML = "";
					}
				}

				// Add colors
				let content_alt = node.querySelector(".palette_colors");

				palette.colors.forEach((color, index) => {
					let node_alt = document.importNode(content_alt, true).children[0];

					node_alt.querySelector(".color").setAttribute("style", `--color: ${color.value}`);
					node_alt.querySelector(".hover_text span").innerText = color.text.slice(0, 50) || `Color ${index + 1}`;
					node_alt.querySelector(".hover_text .color_added_by").src = `/image/${color.added_by}`;
					node_alt.querySelector(".hover_text .color_added_by").setAttribute("alt", palette.people.find(i => i.id == color.added_by).username);
					node_alt.querySelector(".hover_color").innerText = color.value;

					node_alt.querySelector(".color").parentNode.setAttribute("data-index", index);
					node_alt.querySelector(".color").parentNode.setAttribute("data-id", color.id);
					node_alt.querySelector(".color").parentNode.setAttribute("data-color", color.value);

					if(palette.permissions.includes("delete_color")) {
						node_alt.querySelector(".color").parentNode.addEventListener("contextmenu", evt => {
							evt.preventDefault();

							create_overlay({
								title: `Delete ${evt.target.parentNode.getAttribute('data-color')} from ${evt.target.closest(".palette").querySelector(".palette_name").innerText}?`,
								btn_value: "Delete",
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

				node.querySelector(".palette_url").href = `/u/${palette.created_by_slug}/p/${palette.name.replace(/ /g, "-").toLowerCase()}/`

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

				div.appendChild(node);

			});

			document.querySelectorAll(".color").forEach(color => {
				color.addEventListener("click", copy_color);
			});

			update_radius();
		} else {
			document.querySelector(".palettes").appendChild(document.querySelector("template.not_found").content);
		}

	});

}

window.addEventListener("load", render);

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

document.addEventListener("click", evt => {
	// Close detail elements if clicking elsewhere
	let path = evt.path || [];
	document.querySelectorAll("details[open]").forEach(el => {
		if(!path.includes(el)) {
			el.removeAttribute("open");
		}
	});
});

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

function copy_color(evt) {
	let el = evt.target;
	let color = el.querySelector(".hover_color").innerText;
	copy(color);
	// Temporary alert
	el.querySelector(".copy_animation").classList.add("activate_animation");
	setTimeout(() => {
		el.querySelector(".copy_animation").classList.remove("activate_animation");
	}, 1e3);
}