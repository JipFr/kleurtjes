
let collections;

function render() {
	fetch(location.pathname, {
		method: "POST"
	}).then(d => d.json()).then(d => {
		
		let collection_div = document.querySelector(".user_collections");

		collection_div.innerHTML = "";

		collections = d.data.collections;

		for(let collection of collections) {
			console.log(collection);
			let node = document.importNode(document.querySelector("template.small_collection").content, true);
			
			node.querySelector(".title").innerHTML = collection.title;
			node.querySelector(".description").innerHTML = collection.description;
		
			collection_div.appendChild(node);
		
		}

		if(collection_div.children.length === 0) {
			collection_div.appendChild(document.querySelector("template.not_found").content);
		}

	});
}

window.addEventListener("load", render);