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
			console.log(palette);
			let palette_wrapper = get_palette({ palette, show_people: true });
			palette_div.appendChild(palette_wrapper);
		});

	});
}

window.addEventListener("load", render);
