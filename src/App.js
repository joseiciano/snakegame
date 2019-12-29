import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import { CANVAS_SIZE, SNAKE_START, APPLE_START, SCALE, SPEED, DIRECTIONS } from "./constants"


const App = () => {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(null);
  const [topScores, setTopScores] = useState([]);

  useInterval(() => gameLoop(), speed);

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
    let temp = topScores;
    temp.push(score);
    setTopScores(temp);
    setScore(0);
  };

  const moveSnake = ({ keyCode }) => ((keyCode === 65 && dir !== DIRECTIONS[68]) || (keyCode === 68 && dir !== DIRECTIONS[65]) || (keyCode === 83 && dir !== DIRECTIONS[87]) || (keyCode === 87 && dir != DIRECTIONS[83])) && setDir(DIRECTIONS[keyCode]);

  const createApple = () =>
    apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

  const checkCollision = (head, snk = snake) => {
    if (head[0] * SCALE >= CANVAS_SIZE[0] || head[0] < 0 || head[1] * SCALE >= CANVAS_SIZE[1] || head[1] < 0)
      return true;

    for (const segment of snk) 
      if (head[0] === segment[0] && head[1] === segment[1]) 
        return true;

    return false;
  };

  const checkAppleCollision = newSnake => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      while (checkCollision(newApple, newSnake))
        newApple = createApple();
      setApple(newApple);
      return true;
    }

    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);

    if (checkCollision(newSnakeHead)) {
      if (newSnakeHead[0] * SCALE <= 0)
        newSnakeHead[0] = CANVAS_SIZE[0]/SCALE + dir[0];
      else if (newSnakeHead[0] * SCALE >= CANVAS_SIZE[0])
        newSnakeHead[0] = 0;
      else if (newSnakeHead[1] * SCALE <= 0)
        newSnakeHead[1] = CANVAS_SIZE[1]/SCALE + dir[1];
      else if (newSnakeHead[1] * SCALE >= CANVAS_SIZE[1])
        newSnakeHead[1] = 0;
      else 
        endGame();
    } 

    if (!checkAppleCollision(snakeCopy))
      snakeCopy.pop();
    else 
      setScore(score + 50);

    console.log(dir);
    setSnake(snakeCopy);
  };

  const startGame = () => {
    if (!gameOver) {
      setSnake(SNAKE_START);
      setApple(APPLE_START);
    }
    else {
      let min = Math.min(CANVAS_SIZE[0], CANVAS_SIZE[1]);
      let newSnakePos = [Math.floor(Math.random() * (min / SCALE)) % min + 1, Math.floor(Math.random() * (min / SCALE)) % min + 1];
      let newApplePos = [Math.floor(Math.random() * (min / SCALE)) % min + 1, Math.floor(Math.random() * (min / SCALE)) % min + 1];
      while (newApplePos[0] === newSnakePos[0])
        newApplePos[0] = Math.floor(Math.random() * (min / SCALE)) % min + 1;
      while (newApplePos[1] === newSnakePos[1])
        newApplePos[1] = Math.floor(Math.random() * (min / SCALE)) % min + 1;
  
      setSnake([newSnakePos]);
      setApple(newApplePos);
    }
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Snake Rendering
    context.fillStyle = "darkblue";
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));

    // Apple Rendering
    context.fillStyle = "gold";
    context.fillRect(apple[0], apple[1], 1, 1);

    // Grid Rendering
    context.fillStyle = "black";
    for (let i = 1; i <= window.innerWidth; i++) {
      context.fillRect(i, 0, 1/SCALE, window.innerHeight);
      context.fillRect(0, i, window.innerWidth, 1/SCALE);
    }
  }, [snake, apple, gameOver]);

  return (
    <div role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
      <canvas
        style={{border: "1px solid black"}}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />
      {gameOver && <div>GAME OVER!</div>}
      <button onClick={startGame}>Start Game</button>
      <h2>Score: {score}</h2>
      <h3>Top Scores:{<ul>
        {topScores.map((x) => <li>{x}</li>)}
      </ul>}
      </h3>
    </div>
  );
};

export default App;