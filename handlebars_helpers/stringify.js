module.exports = (value) => {
	try {
		return JSON.stringify(value);
	} catch(err) {
		return value;
	}
}