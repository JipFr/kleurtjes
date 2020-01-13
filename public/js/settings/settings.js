function set_username(name) {
	fetch(`/api/set_username/`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			new_name: name
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

function set_color(color) {
	fetch(`/api/set_color/`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({ color })
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
function set_bio(bio) {
	fetch(`/api/set_bio/`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({ bio })
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