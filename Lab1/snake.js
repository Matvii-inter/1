const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("gameOver");
const restartButton = document.getElementById("restartButton");

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let apple = { x: 5, y: 5 };
let score = 0;
let speed = 130; 

document.addEventListener("keydown", changeDirection);
let gameInterval;

function startGame() {
    gameInterval = setInterval(gameLoop, speed);
    placeApple();
    gameOverElement.style.display = "none"; 
    canvas.style.display = "block"; 
}

function gameLoop() {
    moveSnake();
    if (isGameOver()) {
        gameOver();
    } else {
        if (isAppleEaten()) {
            score++;
            scoreElement.textContent = score;
            growSnake();
            placeApple();
            increaseSpeed();
        }
        drawGame();
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    switch (keyPressed) {
        case 37: // Ліво
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 38: // Вгору
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 39: // Право
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
        case 40: // Вниз
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
    }
}

function moveSnake() {
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(newHead);
    snake.pop();
}

function isGameOver() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

function isAppleEaten() {
    return snake[0].x === apple.x && snake[0].y === apple.y;
}

function growSnake() {
    const newTail = { ...snake[snake.length - 1] };
    snake.push(newTail);
}

function placeApple() {
    apple.x = Math.floor(Math.random() * tileCount);
    apple.y = Math.floor(Math.random() * tileCount);
}

function increaseSpeed() {
    clearInterval(gameInterval);
    speed = Math.max(speed - 10, 50);
    gameInterval = setInterval(gameLoop, speed);
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    scoreElement.textContent = score;
    speed = 130; 
    gameOverElement.style.display = "none"; 
    canvas.style.display = "block"; 
    clearInterval(gameInterval);
    startGame();
}

function gameOver() {
    clearInterval(gameInterval);
    gameOverElement.style.display = "block"; 
    canvas.style.display = "none"; 
}

restartButton.addEventListener("click", resetGame);

startGame();
