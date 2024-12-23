export function createMaze (size) {
	const maze = new Maze(size);

	const firstCell = maze.getCell(0,0);
	firstCell.visted = true;

	const stack = [firstCell];

	do {
		const currentCell = stack.pop();

		const unvisitedNeighbors = maze.getUnvisitedNeighbors(currentCell);

		if (unvisitedNeighbors.length > 0) {
			stack.push(currentCell);

			const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length)

			// Array.splice will return an array of one
			const chosenNeighbor = unvisitedNeighbors.splice(randomIndex, 1)[0];

			maze.removeWall(currentCell, chosenNeighbor);
			
			chosenNeighbor.visited = true;
			stack.push(chosenNeighbor);
		}
	} while (stack.length > 0);

	// Create openings for beginning and end of maze
	maze.cells[0].left = false;
	maze.cells[maze.cells.length - 1].right = false;

	return maze;
}

class Maze {
	constructor (size) {
		this.size = typeof size === "number" ?
			size : 10
		this.cells = Array.from({ length: Math.pow(size, 2) }, (_, i) => {
			const x = Math.floor(i / size);
			const y = i % size;

			return {
				x,
				y,
				visited: false,
				top: true,
				right: true,
				bottom: true,
				left: true
			};
		});
	}

	getCell (x, y) {
		if (
			x >= this.size || x < 0 ||
			y >= this.size || y < 0
		) return null;

		const index = (x * this.size) + y;

		return this.cells[index];
	}

	getUnvisitedNeighbors ({x, y}) {
		// Neighbors in clockwise rotation starting with top
		const neighbors = [
			this.getCell(x, y - 1),
			this.getCell(x + 1, y),
			this.getCell(x, y + 1),
			this.getCell(x - 1, y),
		];

		const unvisited = [];

		neighbors.forEach(neighbor => {
			if (neighbor != null && !neighbor.visited)
				unvisited.push(neighbor);
		});

		return unvisited;
	}

	removeWall (cellA, cellB) {
		switch (true) {
			case (cellA.y > cellB.y):
				cellA.top = false;
				cellB.bottom = false;
				break;
			case (cellA.x < cellB.x):
				cellA.right = false;
				cellB.left = false;
				break;
			case (cellA.y < cellB.y):
				cellA.bottom = false;
				cellB.top = false;
				break;
			case (cellA.x > cellB.x):
				cellA.left = false;
				cellB.right = false;
				break;
		}
	}
}