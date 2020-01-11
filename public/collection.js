if(!location.href.endsWith("/")) location.href += "/";

const current_page = document.body.dataset.page;
const palette_div = document.querySelector(".palettes");

let palettes;

function render() {
	fetch("./", { method: "POST" }).then(d => d.json()).then(d => {
		palettes = d.palettes;

		if(typeof manage_open !== "undefined") {
			manage_palette_people(manage_open);
		}

		palette_div.innerHTML = "";
		d.palettes.forEach(palette => {
			let palette_wrapper = get_palette({ palette, show_people: true });
			palette_div.appendChild(palette_wrapper);
		});
		if(palette_div.children.length === 0) {
			let empty_content = document.querySelector("template.not_found").content;
			let empty_node = document.importNode(empty_content, true);
			palette_div.appendChild(empty_node);
		}

	});
}

window.addEventListener("load", render);
