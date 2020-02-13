
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;

let max_distance = 100;
const cube_size = 15;
const gap = 0;

let mouseX = -500;
let mouseY = -500;
document.addEventListener("mousemove", evt => {
	let rect = document.querySelector("canvas").getBoundingClientRect();
	mouseX = evt.clientX - rect.left;
	mouseY = evt.clientY - rect.top;
});

let cubes = [];
class Cube {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.startX = x;
		this.startY = y;
		// this.rot = Math.random() * (Math.PI*2);
		this.rot = 0;
		this.color = `rgb(${y}, ${255 - x}, ${x - 255})`
		this.startColor = this.color + "";
	}
}
for(let x = 5; x < canvas.width; x += cube_size + gap) {
	for(let y = 5; y < canvas.height; y += cube_size + gap) {
		cubes.push(new Cube(x, y));
	}
}

function draw() {

	canvas.width = canvas.scrollWidth;
	canvas.height = canvas.scrollHeight;

	ctx.fillStyle = "white";
	for(let cube of closestCubes) {
		ctx.fillStyle = cube.color || "white";
		ctx.save();
		ctx.translate(cube.x, cube.y);
		ctx.rotate(cube.rot);

		if(cube.shadow) {
			ctx.shadowColor = cube.shadow.color;
			ctx.shadowBlur = cube.shadow.blur;
		}

		ctx.fillRect(-cube_size/2, -cube_size/2, cube_size, cube_size);
		ctx.restore();
	}
}

function calculate() {
	closestCubes = cubes.map(cube => {

		let distX = cube.x - mouseX;
		let distY = cube.y - mouseY;
		
		let distance = Math.sqrt(distX * distX + distY * distY);

		cube.distance = distance;
		return cube;
	}).sort((a, b) => a.distance - b.distance);
	
	closestCubes.forEach(cube => {
		if(cube.distance < max_distance) {
			cube.color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`

			let mouseAngle = Math.atan2(cube.x - mouseX, cube.y - mouseY);
		
			let speed = cube.distance - 40;
			let addX = speed * Math.sin(mouseAngle);
			let addY = speed * Math.cos(mouseAngle);

			cube.x += addX;
			cube.y += addY;

		}

		cube.color = gradient(cube.color, cube.startColor);

		for(let i = 0; i < 5; i++) {
			let distX = cube.startX - cube.x;
			let distY = cube.startY - cube.y;
			let dist = Math.sqrt(distX * distX + distY * distY);

			if(dist > 1) {
				let homeAngle = Math.atan2(distX, distY);

				let newAddX = Math.sin(homeAngle);
				let newAddY = Math.cos(homeAngle);

				cube.x += newAddX;
				cube.y += newAddY;

				cube.shadow = {
					color: "black",
					blur: 15
				}

				// cube.rot += Math.random() / 10;
			} else {
				cube.shadow = null;
			}
		}

	});
}

function gradient(from, to) {
	if(!from) return;
	let f = from.split(/\(|\)/)[1].split(", ").map(d => Number(d));
	let t = to.split(/\(|\)/)[1].split(", ").map(d => Number(d));
	
	
	f.forEach((d, i) => {
		if(t[i] > d) {
			d--
		} else {
			d++
		}
	});

	let diff = 10;
	for(let i = 0; i < f.length; i++) {
		d = f[i];
		let diffA = t[i] - d;
		if(diffA > diff + 1 && t[i] > d) {
			f[i] += Math.random() * diff;
		} else if(diffA < diff - 1) {
			f[i] -= Math.random() * diff;
		}
	}

	return `rgb(${f.join(", ")})`

}

function main() {
	calculate();
	draw();
	requestAnimationFrame(main);
}

main();