const fs = require("fs");
const colors = {
	Reset: "0",
	Bright: "1",
	Dim: "2",
	Underscore: "4",
	Blink: "5",
	Reverse: "7",
	Hidden: "8",

	FgBlack: "30",
	FgRed: "31",
	error: "31",
	FgGreen: "32",
	FgYellow: "33",
	FgBlue: "34",
	FgMagenta: "35",
	FgCyan: "36",
	FgWhite: "37",

	BgBlack: "40",
	BgRed: "41",
	BgGreen: "42",
	BgYellow: "43",
	BgBlue: "44",
	BgMagenta: "45",
	BgCyan: "46",
	BgWhite: "47",
}

const log = (str, set_color = "FgGreen", store = true) => {

	let color = colors[set_color];

	console.log(`\x1b[${color}m%s\x1b[0m`, ">>>", str);
	
	if(store) {
		let d = new Date();
		let file_str = `logs/${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, 0)}-${d.getDate().toString().padStart(2, 0)}.log`;
		fs.appendFileSync(file_str, `(${color} - ${Date.now()}) ${str}\n`);
	}
}

module.exports = log;