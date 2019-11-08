module.exports = () => {
	let possible = "abcdefghijklmnopqrstuvwxyz1234567890";
	let str = "";
	for(let i = 0; i < 50; i++) {
		if(i > 0 && i % 5 == 0) {
			str += "-";
		}
		str += possible[Math.floor(Math.random() * possible.length)];
	}
	return str;
}