const CANVAS_SIZE = [500, 500];
const SCALE = 20;
const SPEED = 100;
const DIRECTIONS = {
  87: [0, -1], // up
  83: [0, 1], // down
  65: [-1, 0], // left
  68: [1, 0] // right
};

const min = Math.min(CANVAS_SIZE[0], CANVAS_SIZE[1]);
const SNAKE_START = [[Math.floor(Math.random() * (min / SCALE)) % min + 1, Math.floor(Math.random() * (min / SCALE)) % min + 1]];
let APPLE_START = [Math.floor(Math.random() * (min / SCALE)) % min + 1, Math.floor(Math.random() * (min / SCALE)) % min + 1];
while (APPLE_START[0] === SNAKE_START[0][0])
  APPLE_START[0] = Math.floor(Math.random() * (min / SCALE)) % min + 1;
while (APPLE_START[1] === SNAKE_START[0][1])
  APPLE_START[1] = Math.floor(Math.random() * (min / SCALE)) % min + 1;

export {CANVAS_SIZE, SNAKE_START, APPLE_START, SCALE, SPEED, DIRECTIONS};