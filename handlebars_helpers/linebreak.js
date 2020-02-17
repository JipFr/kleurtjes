module.exports = str => {
	return str.replace(/</g, "&gt;").replace(/\n/g, "<br>");
}