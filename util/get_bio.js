module.exports = str => {
	return (str || "").toString().trim().slice(0, 240).trim();
}