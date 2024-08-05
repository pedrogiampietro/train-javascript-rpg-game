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
let adamantiteSword = null;
let monsters = [];
let selectedMonster = null;

// Função assíncrona para carregar e inicializar o personagem e monstros
async function init() {
  await spritesController.load();
  character = spritesController.get("character");
  cape = spritesController.get("cape_wings");
  copperChestplate = spritesController.get("copperchestplate");
  tinChestplate = spritesController.get("tinchestplate");
  crystalLegplates = spritesController.get("crystallegplates");
  adamantiteSword = spritesController.get("adamantitesworth");

  if (character) {
    console.log("Character loaded:", character);
    character.x = canvas.width / 2;
    character.y = canvas.height / 2;
  } else {
    console.error("Erro ao carregar o personagem.");
  }

  // Gerar cobras aleatoriamente no mapa
  for (let i = 0; i < 5; i++) {
    let snake = spritesController.get("snake");
    if (snake) {
      snake.x = Math.random() * (canvas.width - snake.width);
      snake.y = Math.random() * (canvas.height - snake.height);
      snake.direction = "walk_down";
      snake.speed = 0.2;
      snake.health = 100; // Adiciona vida ao monstro
      monsters.push(snake);
    }
  }

  gameLoop();
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
    character.addLayer(tinchestplate);
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

// Função para adicionar a espada
function addAdamantiteSword() {
  if (character && adamantiteSword) {
    character.addLayer(adamantiteSword);
  }
}

// Função para remover a espada
function removeAdamantiteSword() {
  if (character && adamantiteSword) {
    character.removeLayer("adamantitesworth");
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

// Função para atacar o monstro
function attackMonster() {
  if (selectedMonster) {
    selectedMonster.health -= 10; // Diminui a vida do monstro
    if (selectedMonster.health <= 0) {
      monsters = monsters.filter((monster) => monster !== selectedMonster);
      selectedMonster = null;
    }
  }
}

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
document
  .getElementById("addAdamantiteSwordButton")
  .addEventListener("click", addAdamantiteSword);
document
  .getElementById("removeAdamantiteSwordButton")
  .addEventListener("click", removeAdamantiteSword);
document
  .getElementById("attackButton")
  .addEventListener("click", attackMonster);

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  selectedMonster = monsters.find(
    (monster) =>
      x >= monster.x &&
      x <= monster.x + monster.width &&
      y >= monster.y &&
      y <= monster.y + monster.height
  );
});

function update(time) {
  if (character) {
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

  // Movimento aleatório dos monstros com pausas
  monsters.forEach((monster) => {
    if (!monster.pause && Math.random() < 0.02) {
      let directions = ["walk_up", "walk_down", "walk_left", "walk_right"];
      monster.direction =
        directions[Math.floor(Math.random() * directions.length)];
      monster.pause = Math.random() < 0.5; // 50% chance de fazer uma pausa
    } else if (monster.pause) {
      monster.pause = Math.random() < 0.98; // 98% chance de continuar pausado
    }

    if (!monster.pause) {
      switch (monster.direction) {
        case "walk_up":
          monster.y -= monster.speed;
          if (monster.y < 0) monster.y = 0;
          break;
        case "walk_down":
          monster.y += monster.speed;
          if (monster.y + monster.height > canvas.height)
            monster.y = canvas.height - monster.height;
          break;
        case "walk_left":
          monster.x -= monster.speed;
          if (monster.x < 0) monster.x = 0;
          break;
        case "walk_right":
          monster.x += monster.speed;
          if (monster.x + monster.width > canvas.width)
            monster.x = canvas.width - monster.width;
          break;
      }
      monster.setAnimation(monster.direction);
    } else {
      monster.setAnimation("idle_down");
    }
    monster.update(time);
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (character) {
    character.render(ctx, character.x, character.y);
  }

  // Renderizar monstros
  monsters.forEach((monster) => {
    monster.render(ctx, monster.x, monster.y);

    // Desenhar círculo ao redor do monstro selecionado
    if (monster === selectedMonster) {
      ctx.beginPath();
      ctx.arc(
        monster.x + monster.width / 2,
        monster.y + monster.height / 2,
        Math.max(monster.width, monster.height),
        0,
        2 * Math.PI
      );
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Exibir vida do monstro
    ctx.fillStyle = "red";
    ctx.fillRect(
      monster.x,
      monster.y - 10,
      (monster.width * monster.health) / 100,
      5
    );
    ctx.strokeStyle = "black";
    ctx.strokeRect(monster.x, monster.y - 10, monster.width, 5);
  });
}

function gameLoop(time) {
  update(time);
  draw();
  requestAnimationFrame(gameLoop);
}

// Inicializa o jogo
init();
