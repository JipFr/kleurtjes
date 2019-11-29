module.exports = str => {
	return (str || "").toString().trim().slice(0, 120).trim();
}