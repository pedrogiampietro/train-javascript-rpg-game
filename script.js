const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configuração inicial do personagem
let character = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 50,
  height: 50,
  color: "blue",
  speed: 5,
};

// Controle de movimentos
let keys = {
  up: false,
  down: false,
  left: false,
  right: false,
};

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") keys.up = true;
  if (event.key === "ArrowDown") keys.down = true;
  if (event.key === "ArrowLeft") keys.left = true;
  if (event.key === "ArrowRight") keys.right = true;
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") keys.up = false;
  if (event.key === "ArrowDown") keys.down = false;
  if (event.key === "ArrowLeft") keys.left = false;
  if (event.key === "ArrowRight") keys.right = false;
});

function update() {
  if (keys.up) character.y -= character.speed;
  if (keys.down) character.y += character.speed;
  if (keys.left) character.x -= character.speed;
  if (keys.right) character.x += character.speed;

  // Limites do canvas
  if (character.x < 0) character.x = 0;
  if (character.y < 0) character.y = 0;
  if (character.x + character.width > canvas.width)
    character.x = canvas.width - character.width;
  if (character.y + character.height > canvas.height)
    character.y = canvas.height - character.height;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = character.color;
  ctx.fillRect(character.x, character.y, character.width, character.height);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
