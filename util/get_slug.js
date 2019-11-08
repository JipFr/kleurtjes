module.exports = async user => {
	let slug = user.emails[0].value.split("@")[0];
	let check_slug = slug;
	let i = 1;
	
	let is_valid = false;
	while(is_valid == false) {
		let user = await db.collection("users").findOne({slug: check_slug});
		if(!user) {
			is_valid = true;
		} else {
			check_slug = `${slug}-${i}`;
			i++
		}
	}
	return check_slug;

}