const fs = require('fs-extra');
require('colors');

class Logger {
	constructor(root = '') {
		root = root.split("/").slice(0, -1).join("/");
		fs.ensureDirSync(`${root}/logs`);

		this.root = root;
		this.streams = {
			latest: fs.createWriteStream(`${this.root}/logs/latest.log`),
			success: fs.createWriteStream(`${this.root}/logs/success.log`),
			error: fs.createWriteStream(`${this.root}/logs/error.log`),
			warn: fs.createWriteStream(`${this.root}/logs/warn.log`),
			info: fs.createWriteStream(`${this.root}/logs/info.log`)
		};
	}
	

	success(input) {
		let prefix = `${this.getTime()}`;
		let n_input = `${prefix} [SUCCESS]: ${input}`;
		this.streams.success.write(`${n_input}\n`);

		console.log(prefix.green.bold, input);
	}

	error(input) {
		let prefix = `${this.getTime()}`;
		let n_input = `${prefix} [ERROR]: ${input}`;
		this.streams.error.write(`${n_input}\n`);

		console.log(prefix.red.bold, input);
	}

	warn(input) {
		let prefix = `[${this.getTime()}]`;
		let n_input = `${prefix} [WARN]: ${input}`;
		this.streams.warn.write(`${n_input}\n`);

		console.log(prefix.yellow.bold, input);
	}

	info(input) {
		let prefix = `${this.getTime()}`;
		let n_input = `${prefix} [INFO]: ${input}`;
		this.streams.info.write(`${n_input}\n`);

		console.log(prefix.cyan.bold, input);
	}

	getTime() {
		const time = new Date();
		return `${time.getHours().toString().padStart(2, 0)}:${time.getMinutes().toString().padStart(2, 0)}:${time.getSeconds().toString().padStart(2, 0)}`
	}

}

const logger = new Logger(__dirname);

module.exports = logger;