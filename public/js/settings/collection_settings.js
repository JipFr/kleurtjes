
let collection_slug = document.querySelector(".settings_wrapper").dataset.collectionSlug;

function set_title(new_title) {
	fetch("/api/c/set_title", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			new_title,
			collection: collection_slug
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) {
			create_overlay({
				title: d.err,
				btn_value: "OK",
				on_submit: _ => true,
				can_cancel: false,
				fields: []
			});
			return;
		}
		location.reload();
	});
}

function set_color(new_color) {
	fetch("/api/c/set_color", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			new_color,
			collection: collection_slug
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) {
			create_overlay({
				title: d.err,
				btn_value: "OK",
				on_submit: _ => true,
				can_cancel: false,
				fields: []
			});
			return;
		}
		location.reload();
	});
}

function set_bio(new_bio) {
	fetch("/api/c/set_bio", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			new_bio,
			collection: collection_slug
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) {
			create_overlay({
				title: d.err,
				btn_value: "OK",
				on_submit: _ => true,
				can_cancel: false,
				fields: []
			});
			return;
		}
		location.reload();
	});
}

function set_slug(new_slug) {
	fetch("/api/c/set_slug", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			new_slug,
			collection: collection_slug
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) {
			create_overlay({
				title: d.err,
				btn_value: "OK",
				on_submit: _ => true,
				can_cancel: false,
				fields: []
			});
			return;
		}
		location.href = `/c/${d.new_slug}/settings/`
	});
}