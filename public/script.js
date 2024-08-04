import SpritesController from "./SpritesController.js";

// Configuração do canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Inicialização do controlador de sprites
const spritesController = new SpritesController();
let character = null;
let cape = null;
let copperChestplate = null;
let tinChestplate = null;
let crystalLegplates = null;

// Função assíncrona para carregar e inicializar o personagem
async function init() {
  await spritesController.load();
  character = spritesController.get("character"); // Nome do personagem na sprites.json
  cape = spritesController.get("cape_wings"); // Nome da capa na sprites.json
  copperChestplate = spritesController.get("copperchestplate"); // Nome do peitoral de cobre na sprites.json
  tinChestplate = spritesController.get("tinchestplate"); // Nome do peitoral de estanho na sprites.json
  crystalLegplates = spritesController.get("crystallegplates"); // Nome do peitoral de cristal na sprites.json

  if (character) {
    console.log("Character loaded:", character);
    gameLoop();
  } else {
    console.error("Erro ao carregar o personagem.");
  }
}

// Função para alternar as asas
function toggleWings() {
  if (character && cape) {
    if (character.layers.includes(cape)) {
      character.removeLayer("cape_wings");
    } else {
      character.addLayer(cape);
    }
  }
}

// Função para adicionar o peitoral de cobre
function addCopperChestplate() {
  if (character && copperChestplate) {
    character.addLayer(copperChestplate);
  }
}

// Função para remover o peitoral de cobre
function removeCopperChestplate() {
  if (character && copperChestplate) {
    character.removeLayer("copperchestplate");
  }
}

// Função para adicionar o peitoral de estanho
function addTinChestplate() {
  if (character && tinChestplate) {
    character.addLayer(tinChestplate);
  }
}

// Função para remover o peitoral de estanho
function removeTinChestplate() {
  if (character && tinChestplate) {
    character.removeLayer("tinchestplate");
  }
}

// Função para adicionar o peitoral de cristal
function addCrystalLegplates() {
  if (character && crystalLegplates) {
    character.addLayer(crystalLegplates);
  }
}

// Função para remover o peitoral de cristal
function removeCrystalLegplates() {
  if (character && crystalLegplates) {
    character.removeLayer("crystallegplates");
  }
}

// Controle de movimentos
let keys = {
  up: false,
  down: false,
  left: false,
  right: false,
};

document.addEventListener("keydown", (event) => {
  if (character) {
    switch (event.key) {
      case "ArrowUp":
        keys.up = true;
        character.setAnimation("walk_up");
        break;
      case "ArrowDown":
        keys.down = true;
        character.setAnimation("walk_down");
        break;
      case "ArrowLeft":
        keys.left = true;
        character.setAnimation("walk_left");
        break;
      case "ArrowRight":
        keys.right = true;
        character.setAnimation("walk_right");
        break;
    }
  }
});

document.addEventListener("keyup", (event) => {
  if (character) {
    switch (event.key) {
      case "ArrowUp":
        keys.up = false;
        break;
      case "ArrowDown":
        keys.down = false;
        break;
      case "ArrowLeft":
        keys.left = false;
        break;
      case "ArrowRight":
        keys.right = false;
        break;
    }
    if (!keys.up && !keys.down && !keys.left && !keys.right) {
      character.setAnimation("idle_down");
    }
  }
});

// Adicionar eventos para os botões
document
  .getElementById("toggleWingsButton")
  .addEventListener("click", toggleWings);
document
  .getElementById("addCopperChestplateButton")
  .addEventListener("click", addCopperChestplate);
document
  .getElementById("removeCopperChestplateButton")
  .addEventListener("click", removeCopperChestplate);
document
  .getElementById("addTinChestplateButton")
  .addEventListener("click", addTinChestplate);
document
  .getElementById("removeTinChestplateButton")
  .addEventListener("click", removeTinChestplate);
document
  .getElementById("addCrystalLegplatesButton")
  .addEventListener("click", addCrystalLegplates);
document
  .getElementById("removeCrystalLegplatesButton")
  .addEventListener("click", removeCrystalLegplates);

function update() {
  if (character) {
    const time = Date.now();
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

    character.update(time);
  }
}

function draw() {
  if (character) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    character.render(ctx, character.x, character.y);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Inicializa o jogo
init();
