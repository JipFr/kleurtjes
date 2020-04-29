if(!location.href.endsWith("/")) location.href += "/";

const palette_div = document.querySelector(".palettes");

let palettes;

function render() {
	fetch("./", { method: "POST" }).then(d => d.json()).then(d => {
		palettes = d.palettes;

		if(typeof manage_open !== "undefined") {
			manage_palette_people(manage_open);
		}

		palette_div.innerHTML = "";
		d.palettes.forEach((palette, index) => {
			// let palette_wrapper = get_palette({ palette, show_people: true });
			let palette_wrapper = get_palette({
				palette, 
				index, 
				can_move_down: index < d.palettes.length - 1 && palettes.length > 1 && document.body.dataset.isCollectionAdmin == "true",
				can_move_up: index > 0 && palettes.length > 1 && document.body.dataset.isCollectionAdmin == "true"
			});
			palette_div.appendChild(palette_wrapper);
		});
		if(palette_div.children.length === 0) {
			let empty_content = document.querySelector("template.not_found").content;
			let empty_node = document.importNode(empty_content, true);
			palette_div.appendChild(empty_node);
		}

		update_radius();

	});

}

window.addEventListener("load", render);

function move_palette(direction, id) {
	let collection_id = document.body.dataset.collection;

	close_details();

	fetch(`/api/move_palette/`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			dir: direction,
			id,
			page: current_page,
			collection_id
		})
	}).then(d => d.json()).then(d => {
		if(!d.status == 200) return;
		render();
	});

}