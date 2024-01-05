import "./style.css";

// game
let gameOver = false;
let score = 0;

//board
let board;
const boardWidth = 360;
const boardHeight = 640;
let context;

// bird
let birdImg;
const birdWidth = 23;
const birdHeight = 33;
const birdX = boardWidth / 8;
const birdY = boardHeight / 2;

const bird = {
  x: birdX,
  y: birdY,
  height: birdHeight,
  width: birdWidth,
};

// pipes
let topPipeImg, bottomPipeImg;
let pipeArr = [];
const pipeWidth = 64;
const pipeHeight = 512;
const pipeX = boardWidth;
const pipeY = 0;

// physics
let velocityX = -2; // forward speed
let velocityY = 0; // bird jump speed
let gravity = 0.4;

window.onload = () => {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d");

  birdImg = new Image();
  birdImg.src = "./public/farris.webp";

  topPipeImg = new Image();
  bottomPipeImg = new Image();
  topPipeImg.src = "./public/toppipe.webp";
  bottomPipeImg.src = "./public/bottompipe.webp";

  birdImg.onload = () =>
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  requestAnimationFrame(update);
  setInterval(placePipes, 3500);
  document.addEventListener("keydown", birdJump);
  document.addEventListener("click", birdJump);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  if (bird.y > board.height) {
    gameOver = true;
  }

  pipeArr.forEach((pipe) => {
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }
    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  });

  //clear pipes
  while (pipeArr.length > 0 && pipeArr[0].x < -pipeWidth) {
    pipeArr.shift();
  }

  // update score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver){
    context.fillText('Game Over', 5, 90)
    context.drawImage(birdImg, (board.width/2 - 66), board.height/3, 132, 92)
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - (Math.random() * pipeHeight) / 2;
  const openingSpace = pipeHeight / 4;
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArr.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArr.push(bottomPipe);
}

function birdJump() {
  velocityY = -6;

  //reset game
  if (gameOver) {
    bird.y = birdY;
    pipeArr = [];
    score = 0;
    gameOver = false;
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
