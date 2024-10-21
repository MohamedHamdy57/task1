

const directions = ["NORTH", "EAST", "SOUTH", "WEST"];
const moveMapping = {
    NORTH: { x: 0, y: 1 },
    EAST: { x: 1, y: 0 },
    SOUTH: { x: 0, y: -1 },
    WEST: { x: -1, y: 0 }
};

class Rover {
    constructor(x, y, direction, obstacles = []) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.obstacles = obstacles; // List of obstacles in the format [[x1, y1], [x2, y2], ...]
        this.stopped = false;
    }

    // Method to check if the next move hits an obstacle
    checkForObstacles(nextX, nextY) {
        return this.obstacles.some(obstacle => obstacle[0] === nextX && obstacle[1] === nextY);
    }

    // Move forward, but stop if an obstacle is ahead
    moveForward() {
        const nextX = this.x + moveMapping[this.direction].x;
        const nextY = this.y + moveMapping[this.direction].y;

        if (this.checkForObstacles(nextX, nextY)) {
            this.stopped = true; // Set stopped state
            return; // Stop without moving
        }
        
        this.x = nextX;
        this.y = nextY;
    }

    // Move backward, but stop if an obstacle is behind
    moveBackward() {
        const nextX = this.x - moveMapping[this.direction].x;
        const nextY = this.y - moveMapping[this.direction].y;

        if (this.checkForObstacles(nextX, nextY)) {
            this.stopped = true; // Set stopped state
            return; // Stop without moving
        }
        
        this.x = nextX;
        this.y = nextY;
    }

    // Execute single command (F, B, L, R)
    executeCommand(command) {
        if (this.stopped) return; // Do nothing if already stopped

        const actions = {
            "F": () => this.moveForward(),
            "B": () => this.moveBackward(),
            "L": () => this.rotateLeft(),
            "R": () => this.rotateRight()
        };

        if (actions[command]) actions[command](); // Call the respective action
        
    }
    

    // Execute a string of commands (e.g., "FRFFL")
    executeCommands(commands) {
        [...commands].forEach(cmd => this.executeCommand(cmd));
    }

    // Rotate the rover to the left
    rotateLeft() {
        this.direction = directions[(directions.indexOf(this.direction) + 3) % 4];
    }

    // Rotate the rover to the right
    rotateRight() {
        this.direction = directions[(directions.indexOf(this.direction) + 1) % 4];
    }

    // Return the rover's current position and heading, and report if stopped due to collision
    getPosition() {
        if (this.stopped) {
            return `(${this.x}, ${this.y}) ${this.direction} STOPPED due to crash`;
        }
        return `(${this.x}, ${this.y}) ${this.direction}`;
    }
}

// Example HTML interaction
document.getElementById('sendCommands').addEventListener('click', function() {
    const commands = document.getElementById('commands').value; // Get the user commands input
    const obstacles = [[1, 4], [3, 5], [7, 4]]; // Known obstacle coordinates
    const rover = new Rover(4, 2, 'EAST', obstacles); // Start rover at position (4, 2), facing EAST
    rover.executeCommands(commands); // Execute the entered commands
    document.getElementById('output').innerText = `Rover position: ${rover.getPosition()}`; // Output the rover's final position and status
});


