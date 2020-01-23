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
					can_move_down: index < d.data.palettes.length - 1 && palettes.length > 1 && (current_page === "dashboard" || current_page === "own"),
					can_move_up: index > 0 && palettes.length > 1 && (current_page === "dashboard" || current_page === "own"),
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