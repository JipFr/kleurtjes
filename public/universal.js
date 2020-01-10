function create_overlay({title, fields, can_cancel, btn_value, on_submit}) {

	let overlay_content = document.querySelector(".templates template.overlay_wrapper").content;
	let overlay = document.importNode(overlay_content, true);

	overlay.querySelector(".title").innerHTML = title;

	fields.forEach(field => {

		let input_div;
		if(field.type == "checkbox") {

			input_div = document.importNode(document.querySelector(".templates template.checkbox_input").content, true);

			if(field.checked) {
				input_div.querySelector("input").checked = true;
			}

		} else {
			
			input_div = document.importNode(document.querySelector(".templates template.input_div").content, true);

			input_div.querySelector("input").placeholder = field.placeholder || "";
			input_div.querySelector("input").classList.add("enterable");

			if(!field.accept_color_picker) {
				input_div.querySelector(".color_picker_wrapper").remove();
				input_div.querySelector(".input input").removeAttribute("oninput");
			} else {
				input_div.querySelector(".color_picker_input").value = field.placeholder || "";
				input_div.querySelector(".color_picker_wrapper").setAttribute("style", `background: ${field.placeholder}`);
			}
			
		}

		input_div.querySelector("label").innerText = field.label;
		input_div.querySelector("label").setAttribute("for", field.name);
		
		input_div.querySelector("input").setAttribute("name", field.name);
		input_div.querySelector("input").id = field.name;
		
		for(let item of field.classes) {
			input_div.querySelector(".input_div").classList.add(item);
		}

		overlay.querySelector(".fields").appendChild(input_div);

	});

	if(!can_cancel) overlay.querySelector("button.cancel").remove();

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
	to_focus ? to_focus.focus() : "";
}

function remove_overlays() {
	manage_open = undefined;
	document.querySelectorAll(".all .overlay_wrapper").forEach(overlay => {
		overlay.remove();
	});
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
	document.querySelector(`[name="theme-color"]`).setAttribute("content", get_style(document.querySelector("header"), "backgroundColor"));
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