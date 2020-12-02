module.exports = user => {
	// Get photo URL
	let photoUrl = user.user.photos[0].value;
	
	// Get higher resolution
	photoUrl = photoUrl.replace(/=s96/g, "=s300");

	// Return URL
	return photoUrl;
}