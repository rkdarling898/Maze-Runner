import { createMaze } from "./maze.js";

let CELL_SIZE = 20;
let MAZE_SIZE = 13;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const cameraOffset = {
	x: CELL_SIZE,
	y: CELL_SIZE
}

const player = {
	x: 0,
	y: 0
};

function cellOnScreen (cell) {
	// Function name is misleading since I'm adding margin to look for too
	// Teehee
	const x = (cell.x * CELL_SIZE) + cameraOffset.x;
	const y = (cell.y * CELL_SIZE) + cameraOffset.y;

	return (
		x + CELL_SIZE < canvas.width &&
		x - CELL_SIZE >= 0 &&
		y + CELL_SIZE < canvas.height &&
		y - CELL_SIZE >= 0
	);
}

function drawWall (x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.closePath();
}

function fillCell (x, y) {
	ctx.fillRect(
		cameraOffset.x + (x * CELL_SIZE),
		cameraOffset.y + (y * CELL_SIZE),
		CELL_SIZE, CELL_SIZE 
	);
}

function gameLoop () {
	if (player.x === maze.size - 1 && player.y === maze.size - 1) reset();

	render();

	requestAnimationFrame(gameLoop);
}

function playerIsBlocked (moveDirection) {
	let neighbor;

	switch (moveDirection) {
		case "up":
			neighbor = maze.getCell(player.x, player.y - 1);
			return (neighbor === null || neighbor.bottom);
			break;
		case "right":
			neighbor = maze.getCell(player.x + 1, player.y);
			return (neighbor === null || neighbor.left);
			break;
		case "down":
			neighbor = maze.getCell(player.x, player.y + 1);
			return (neighbor === null || neighbor.top);
			break;
		case "left":
			neighbor = maze.getCell(player.x - 1, player.y);
			return (neighbor === null || neighbor.right);
			break;
		default:
			return true;
			break;
	}
}

function render () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Highlight beginning and end areas
	ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
	fillCell(0, 0);

	ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
	fillCell(maze.size - 1, maze.size - 1);

	// Render the player
	ctx.fillStyle = "rgba(0, 0, 100, 0.8)";
	fillCell(player.x, player.y);

	// x and y offset of cell size
	maze.cells.forEach(cell => {
		if (!cellOnScreen(cell)) return;

		const x = (cell.x * CELL_SIZE) + cameraOffset.x;
		const y = (cell.y * CELL_SIZE) + cameraOffset.y;

		if (cell.top) drawWall(x, y, x + CELL_SIZE, y);
		if (cell.right) drawWall(x + CELL_SIZE, y, x + CELL_SIZE, y + CELL_SIZE);
		if (cell.bottom) drawWall(x, y + CELL_SIZE, x + CELL_SIZE, y + CELL_SIZE);
		if (cell.left) drawWall(x, y, x, y + CELL_SIZE);
	});
}

function reset () {
	maze = createMaze(MAZE_SIZE);

	player.x = player.y = 0;
	
	cameraOffset.x = cameraOffset.y = CELL_SIZE;
}

function sizeCanvas () {
	const size = Math.floor((window.innerHeight * 0.8) / 100) * 100;

	canvas.width = canvas.height = size;
}

addEventListener('keydown', e => {
	const x = (player.x * CELL_SIZE) + cameraOffset.x;
	const y = (player.y * CELL_SIZE) + cameraOffset.y;

	switch (e.key) {
		case ' ':
			MAZE_SIZE = Number(
				prompt("Set your prefered maze size (this number for width and height)", MAZE_SIZE)
			);
			reset();
			break;
		case "ArrowUp":
			if (!playerIsBlocked("up")) {
				player.y -= 1;
				if (y < canvas.height/2 && !cellOnScreen(maze.getCell(player.x, 0)))
					cameraOffset.y += CELL_SIZE;
			}
			break;
		case "ArrowDown":
			if (!playerIsBlocked("down")) {
				player.y += 1;
				if (y > canvas.height/2 && !cellOnScreen(maze.getCell(player.x, maze.size - 1)))
					cameraOffset.y -= CELL_SIZE;
			}
			break;
		case "ArrowLeft":
			if (!playerIsBlocked("left")) {
				player.x -= 1;
				if (x < canvas.width/2 && !cellOnScreen(maze.getCell(0, player.y)))
					cameraOffset.x += CELL_SIZE;
			}

			break;
		case "ArrowRight":
			if (!playerIsBlocked("right")) {
				player.x += 1;
				if (x > canvas.width/2 && !cellOnScreen(maze.getCell(maze.size - 1, player.y)))
					cameraOffset.x -= CELL_SIZE;
			}
			break;
	}
});

addEventListener("resize", sizeCanvas);

sizeCanvas();

let maze = createMaze(MAZE_SIZE);

gameLoop();