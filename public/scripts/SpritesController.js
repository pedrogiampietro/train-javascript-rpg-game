import Sprite from "./Sprite.js";

export default class SpritesController {
  constructor() {
    this.sprites = {};
  }

  async load() {
    try {
      const response = await fetch("sprites.json");
      const spriteData = await response.json();
      console.log("Sprite data loaded:", spriteData);

      for (let data of spriteData.sprites) {
        console.log("Loading sprite:", data);
        let sprite = new Sprite(data);
        sprite.key = data.key;
        this.sprites[data.key] = sprite;
        console.log("Loaded sprite:", sprite);
      }

      console.log("Finished loading sprite data...");
    } catch (error) {
      console.error("Failed to load sprite data:", error);
    }
  }

  get(name) {
    console.log("Getting sprite:", name, this.sprites[name]);
    return this.sprites[name];
  }
}
