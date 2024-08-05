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

// Configuração do personagem e sistema de experiência
let player = {
  level: 1,
  experience: 0,
  experienceToNextLevel: 100,
  x: canvas.width / 2,
  y: canvas.height / 2,
  speed: 2,
};

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
    character.x = player.x;
    character.y = player.y;
  } else {
    console.error("Erro ao carregar o personagem.");
  }

  // Gerar cobras aleatoriamente no mapa
  spawnSnakes(5);

  gameLoop();
}

// Função para gerar cobras aleatoriamente no mapa
function spawnSnakes(count) {
  for (let i = 0; i < count; i++) {
    let snake = spritesController.get("snake");
    if (snake) {
      snake = Object.create(snake); // Cria um novo objeto a partir do protótipo
      snake.x = Math.random() * (canvas.width - snake.width);
      snake.y = Math.random() * (canvas.height - snake.height);
      snake.direction = "walk_down";
      snake.speed = 0.2;
      snake.health = 100; // Adiciona vida ao monstro
      snake.damage = []; // Array para mostrar danos
      monsters.push(snake);
    }
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
    console.log("Attacking monster:", selectedMonster);
    let damage = 10;
    selectedMonster.health -= damage; // Diminui a vida do monstro
    selectedMonster.damage.push({ value: damage, time: Date.now() }); // Adiciona o dano ao array de danos
    if (selectedMonster.health <= 0) {
      console.log("Monster defeated:", selectedMonster);
      monsters = monsters.filter((monster) => monster !== selectedMonster);
      gainExperience(50); // Ganha experiência ao derrotar um monstro
      respawnMonster(selectedMonster); // Chama a função de respawn
      selectedMonster = null;
    }
  } else {
    console.log("No monster selected");
  }
}

// Função para ganhar experiência
function gainExperience(amount) {
  player.experience += amount;
  while (player.experience >= player.experienceToNextLevel) {
    player.experience -= player.experienceToNextLevel;
    player.level++;
    player.experienceToNextLevel = Math.round(
      player.experienceToNextLevel * 1.5
    ); // Aumenta a experiência necessária para o próximo nível
  }
}

// Função para respawn do monstro
function respawnMonster(monster) {
  setTimeout(() => {
    let newSnake = spritesController.get("snake");
    if (newSnake) {
      newSnake = Object.create(newSnake); // Cria um novo objeto a partir do protótipo
      newSnake.x = Math.random() * (canvas.width - newSnake.width);
      newSnake.y = Math.random() * (canvas.height - newSnake.height);
      newSnake.direction = "walk_down";
      newSnake.speed = 0.2;
      newSnake.health = 100; // Adiciona vida ao novo monstro
      newSnake.damage = []; // Array para mostrar danos
      monsters.push(newSnake);
      console.log("Monster respawned:", newSnake);
    }
  }, 5000); // Respawn após 5 segundos
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
      if (typeof monster.setAnimation === "function") {
        monster.setAnimation(monster.direction);
      }
      monster.update(time);
    } else {
      if (typeof monster.setAnimation === "function") {
        monster.setAnimation("idle_down");
      }
    }
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

    // Mostrar danos
    monster.damage.forEach((d, index) => {
      ctx.fillStyle = "yellow";
      ctx.fillText(d.value, monster.x, monster.y - 20 - index * 15);
      if (Date.now() - d.time > 1000) {
        monster.damage.splice(index, 1); // Remove dano após 1 segundo
      }
    });
  });

  // Mostrar nível e experiência do jogador
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText(`Level: ${player.level}`, 10, 20);
  ctx.fillText(
    `XP: ${player.experience}/${player.experienceToNextLevel}`,
    10,
    40
  );

  // Desenhar barra de experiência
  ctx.fillStyle = "green";
  ctx.fillRect(
    10,
    50,
    (300 * player.experience) / player.experienceToNextLevel,
    20
  );
  ctx.strokeStyle = "black";
  ctx.strokeRect(10, 50, 300, 20);
}

function gameLoop(time) {
  update(time);
  draw();
  requestAnimationFrame(gameLoop);
}

// Inicializa o jogo
init();
